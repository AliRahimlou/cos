from __future__ import annotations

import json
import posixpath
import shutil
import struct
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parents[1]
PPTX_PATH = ROOT / "Sales Rep Onboarding Training Deck.pptx"
OUTPUT_DIR = ROOT / "src" / "content" / "onboarding" / "sales-rep" / "source"
ASSET_DIR = ROOT / "public" / "onboarding" / "sales-rep" / "deck-assets"

NAMESPACES = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
}

VISUAL_SUMMARIES = {
    2: "Historic 'first office' photo labelled 1988 with a family-owned-and-operated badge.",
    18: "Sharp printer naming convention visual that labels the BP model prefix, series, version, color or mono code, and print speed.",
    19: "Product comparison visual pairing example printer, multifunction printer, and floor copier images.",
    20: "Acquisition options graphic comparing lease (60, 48, or 36 month terms), rental (12-month option), and purchase (upfront payment).",
    29: "Circular auto-restock icon that reinforces supply automation.",
    35: "Handshake photo used behind the approval-to-delivery flowchart.",
    36: "Celebratory image used behind the approvals summary slide.",
}


def normalize_target(base_path: str, target: str) -> str:
    return posixpath.normpath(posixpath.join(posixpath.dirname(base_path), target))


def dedupe(items: list[str]) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []

    for item in items:
        stripped = item.strip()
        if not stripped or stripped in seen:
            continue
        seen.add(stripped)
        ordered.append(stripped)

    return ordered


def infer_title(texts: list[str]) -> str:
    meaningful = [text for text in texts if text != "​"]

    if not meaningful:
        return ""

    if len(meaningful) >= 2 and len(meaningful[0]) <= 24 and len(meaningful[1]) <= 32:
        return " ".join(meaningful[:2]).replace("  ", " ").strip()

    return meaningful[0]


def get_png_size(data: bytes) -> tuple[int, int] | None:
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        return None

    width, height = struct.unpack(">II", data[16:24])
    return width, height


def read_xml(archive: ZipFile, path: str) -> ET.Element:
    return ET.fromstring(archive.read(path))


def extract_assets() -> list[dict[str, Any]]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    ASSET_DIR.mkdir(parents=True, exist_ok=True)

    for path in ASSET_DIR.iterdir():
        if path.is_file():
            path.unlink()
        elif path.is_dir():
            shutil.rmtree(path)

    with ZipFile(PPTX_PATH) as archive:
        presentation = read_xml(archive, "ppt/presentation.xml")
        presentation_rels = read_xml(archive, "ppt/_rels/presentation.xml.rels")
        rel_map = {
            rel.attrib["Id"]: normalize_target("ppt/presentation.xml", rel.attrib["Target"])
            for rel in presentation_rels
        }

        slide_paths = []
        for slide_ref in presentation.find("p:sldIdLst", NAMESPACES) or []:
            rel_id = slide_ref.attrib[
                "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
            ]
            slide_paths.append(rel_map[rel_id])

        slides: list[dict[str, Any]] = []

        for index, slide_path in enumerate(slide_paths, start=1):
            slide_xml = read_xml(archive, slide_path)
            slide_texts = dedupe(
                [node.text or "" for node in slide_xml.findall(".//a:t", NAMESPACES)]
            )

            rels_path = (
                f"{posixpath.dirname(slide_path)}/_rels/{posixpath.basename(slide_path)}.rels"
            )
            diagram_texts: list[str] = []
            notes: list[str] = []
            images: list[dict[str, Any]] = []

            if rels_path in archive.namelist():
                slide_rels = read_xml(archive, rels_path)

                for rel in slide_rels:
                    rel_type = rel.attrib["Type"].split("/")[-1]
                    target_path = normalize_target(slide_path, rel.attrib["Target"])

                    if rel_type == "diagramData":
                        diagram_xml = read_xml(archive, target_path)
                        diagram_texts.extend(
                            dedupe(
                                [
                                    node.text or ""
                                    for node in diagram_xml.iter()
                                    if node.text and node.text.strip()
                                ]
                            )
                        )

                    if rel_type == "notesSlide":
                        notes_xml = read_xml(archive, target_path)
                        notes.extend(
                            dedupe(
                                [
                                    node.text or ""
                                    for node in notes_xml.iter()
                                    if node.text and node.text.strip()
                                ]
                            )
                        )

                    if rel_type == "image":
                        asset_bytes = archive.read(target_path)
                        original_name = Path(target_path).name
                        destination_name = f"slide-{index:02d}-{len(images) + 1}-{original_name}"
                        destination_path = ASSET_DIR / destination_name
                        destination_path.write_bytes(asset_bytes)

                        size = get_png_size(asset_bytes)
                        images.append(
                            {
                                "originalPath": target_path,
                                "publicPath": f"/onboarding/sales-rep/deck-assets/{destination_name}",
                                "width": size[0] if size else None,
                                "height": size[1] if size else None,
                            }
                        )

            slides.append(
                {
                    "slideNumber": index,
                    "title": infer_title(slide_texts),
                    "texts": slide_texts,
                    "diagramTexts": dedupe(diagram_texts),
                    "notes": dedupe(notes),
                    "images": images,
                    "manualVisualSummary": VISUAL_SUMMARIES.get(index),
                }
            )

    output_path = OUTPUT_DIR / "deck-extraction.json"
    output_path.write_text(
        json.dumps(
            {
                "deck": PPTX_PATH.name,
                "slideCount": len(slides),
                "slides": slides,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    return slides


if __name__ == "__main__":
    extracted = extract_assets()
    print(f"Extracted {len(extracted)} slides from {PPTX_PATH.name}")
