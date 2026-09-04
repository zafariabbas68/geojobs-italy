"""
LinkedIn Job Scraper for NETHERLANDS
====================================
Scrapes geo/GIS jobs in Netherlands using Apify's LinkedIn Jobs Scraper.
Filters to keep ONLY jobs located in Netherlands.
"""

import json
import os
import time
import requests
import openpyxl
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

# ─────────────────────────────────────────────
#  CONFIGURATION FOR NETHERLANDS
# ─────────────────────────────────────────────

TOKEN_ENV_VAR = "APIFY_API_TOKEN"
TOKEN_FILE = Path(__file__).with_name(".env")
TOKEN_PLACEHOLDER = "apify_api_XXXXXXXXXXXX"


def load_local_env() -> dict[str, str]:
    values = {}
    if not TOKEN_FILE.exists():
        return values
    for line in TOKEN_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[len("export "):].strip()
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip("\"'")
    return values


LOCAL_ENV = load_local_env()


def load_setting(name: str, default: str = "") -> str:
    return os.environ.get(name, LOCAL_ENV.get(name, default)).strip()


def load_int_setting(name: str, default: int) -> int:
    value = load_setting(name, str(default))
    try:
        return int(value)
    except ValueError:
        print(f"⚠ Invalid integer for {name}='{value}', using {default}.")
        return default


def load_apify_token() -> str:
    return load_setting(TOKEN_ENV_VAR)


APIFY_API_TOKEN = load_apify_token()

# NETHERLANDS-SPECIFIC SETTINGS
LOCATION = "Netherlands"
GEO_ID = "102890719"  # Geo ID for Netherlands
PUBLISHED_AT = "r86400"  # Last 24 hours
EXPERIENCE_LEVELS = ["1", "2"]  # Internship, Entry level
CONTRACT_TYPES = ["F", "P", "I"]  # Full-time, Part-time, Internship

SCRAPER_TIMEZONE = load_setting("JOBSCRAPER_TIMEZONE", "Europe/Amsterdam")

try:
    SCRAPER_TZ = ZoneInfo(SCRAPER_TIMEZONE)
except ZoneInfoNotFoundError as e:
    raise RuntimeError(f"Timezone not available: {e}")

RUN_STARTED_AT_UTC = datetime.now(timezone.utc)
RUN_STARTED_AT = RUN_STARTED_AT_UTC.astimezone(SCRAPER_TZ)
RUN_SHEET_NAME = RUN_STARTED_AT.strftime("%Y-%m-%d %H-%M-%S")

LINKEDIN_ACTOR_ID = "curious_coder~linkedin-jobs-scraper"
MAX_RESULTS_PER_SEARCH = load_int_setting("JOBSCRAPER_MAX_RESULTS_PER_SEARCH", 100)

EXCEL_OUTPUT_FILE = Path(__file__).with_name("jobs_netherlands.xlsx")

# ─────────────────────────────────────────────
#  KEYWORDS FOR NETHERLANDS
# ─────────────────────────────────────────────

KEYWORDS = [
    # English
    "GIS",
    "Geospatial",
    "Remote Sensing",
    "GIS Analyst",
    "GIS Developer",
    "Cartography",
    "Geomatics",
    "Earth Observation",
    "Spatial Data",
    "GeoAI",
    "Geodata",
    # Dutch
    "GIS Nederland",
    "Geospatial Nederland",
    "Geo-informatie",
    "Geo-informatica",
    "Cartografie",
    "Remote Sensing Nederland",
    "GIS Specialist Nederland",
    "Geomatica",
    "Topografie",
    "Geo-ICT",
]

# ─────────────────────────────────────────────
#  NETHERLANDS LOCATION FILTER
# ─────────────────────────────────────────────

# Comprehensive list of Dutch cities
NETHERLANDS_CITIES = [
    "amsterdam", "rotterdam", "den haag", "the hague", "utrecht", "eindhoven",
    "tilburg", "groningen", "almere", "breda", "nijmegen", "enschede",
    "haarlem", "arnhem", "zaanstad", "amersfoort", "apeldoorn", "hoofddorp",
    "maastricht", "leiden", "dordrecht", "zoetermeer", "zwolle", "deventer",
    "delft", "alkmaar", "heerlen", "venlo", "leeuwen", "hilversum",
    "den bosch", "'s-hertogenbosch", "tilburg", "almelo", "helmond",
    "gouda", "lelystad", "alphen aan den rijn", "zaandam", "bergen op zoom"
]

# Dutch regions/provinces
NETHERLANDS_REGIONS = [
    "noord-holland", "zuid-holland", "utrecht", "gelderland", "noord-brabant",
    "overijssel", "limburg", "flevoland", "drenthe", "friesland",
    "groningen", "zeeland", "brabant", "holland"
]

# Non-Netherlands locations to reject
NON_NETHERLANDS_INDICATORS = [
    "usa", "uk", "germany", "deutschland", "france", "spain", "italy", "italia",
    "canada", "australia", "belgium", "belgië", "luxembourg", "switzerland",
    "austria", "denmark", "sweden", "norway", "poland", "united states",
    "united kingdom", "england", "london", "berlin", "paris", "madrid", "rome"
]


# ─────────────────────────────────────────────
#  APIFY API CALL
# ─────────────────────────────────────────────

def build_linkedin_search_url(keyword: str) -> str:
    """Build LinkedIn search URL with Netherlands filters"""
    params = {
        "keywords": keyword,
        "location": LOCATION,
        "geoId": GEO_ID,
        "f_TPR": PUBLISHED_AT,
        "f_E": ",".join(EXPERIENCE_LEVELS),
        "f_JT": ",".join(CONTRACT_TYPES),
    }
    return f"https://www.linkedin.com/jobs/search/?{urlencode(params)}"


def scrape_linkedin_jobs(search_url: str, keyword: str) -> list[dict]:
    """Scrape jobs using Apify actor"""

    payload = {
        "urls": [search_url],
        "count": MAX_RESULTS_PER_SEARCH,
        "scrapeCompany": True,
        "useIncognitoMode": True,
        "splitByLocation": False,
    }

    print(f"    Calling Apify actor for '{keyword}'...")

    try:
        url = f"https://api.apify.com/v2/acts/{LINKEDIN_ACTOR_ID}/run-sync-get-dataset-items"
        params = {
            "token": APIFY_API_TOKEN,
            "timeout": 120,
            "memory": 512,
            "maxItems": MAX_RESULTS_PER_SEARCH,
        }

        response = requests.post(url, params=params, json=payload, timeout=180)

        # Try to parse the response
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"    ✓ Found {len(data)} jobs")
                return data
            elif isinstance(data, dict) and "items" in data:
                print(f"    ✓ Found {len(data['items'])} jobs")
                return data["items"]
            else:
                print(f"    ⚠ Unexpected response format: {type(data)}")
                return []
        elif response.status_code == 201:
            try:
                data = response.json()
                if isinstance(data, list):
                    print(f"    ✓ Found {len(data)} jobs (201 response)")
                    return data
                elif isinstance(data, dict):
                    if "id" in data and "link" in data:
                        print(f"    ✓ Found 1 job (201 response)")
                        return [data]
                    elif "items" in data:
                        print(f"    ✓ Found {len(data['items'])} jobs (201 response)")
                        return data["items"]
                print(f"    ⚠ Unrecognized 201 response format")
                return []
            except json.JSONDecodeError:
                print(f"    ⚠ Could not parse 201 response as JSON")
                return []
        else:
            print(f"    ⚠ API error: {response.status_code}")
            try:
                error_data = response.json()
                if isinstance(error_data, dict) and "error" in error_data:
                    print(f"    Error: {error_data['error'].get('message', str(error_data))}")
                else:
                    print(f"    Response: {response.text[:200]}")
            except:
                print(f"    Response: {response.text[:200]}")
            return []

    except requests.exceptions.Timeout:
        print(f"    ⚠ Timeout for '{keyword}'")
        return []
    except Exception as e:
        print(f"    ⚠ Exception: {e}")
        return []


def fetch_jobs_for_keyword(keyword: str) -> list[dict]:
    """Fetch jobs for a single keyword"""
    search_url = build_linkedin_search_url(keyword)
    print(f"\n🔍 Searching: {keyword}")
    print(f"   URL: {search_url[:80]}...")

    jobs = scrape_linkedin_jobs(search_url, keyword)

    # Add source info to each job
    for job in jobs:
        job["_source"] = "linkedin"
        job["_source_label"] = "LinkedIn"
        job["keyword"] = keyword

    return jobs


def run_all_searches() -> list[dict]:
    """Run searches for all keywords"""
    all_jobs = []

    print("=" * 60)
    print(f"  🇳🇱 LinkedIn Job Scraper — NETHERLANDS (Netherlands Only)")
    print(f"  Run started: {RUN_STARTED_AT.strftime('%Y-%m-%d %H:%M %Z')}")
    print(f"  Keywords: {len(KEYWORDS)}")
    print(f"  Max results per keyword: {MAX_RESULTS_PER_SEARCH}")
    print("=" * 60)

    for i, keyword in enumerate(KEYWORDS, 1):
        print(f"\n[{i}/{len(KEYWORDS)}] Processing...")
        jobs = fetch_jobs_for_keyword(keyword)
        all_jobs.extend(jobs)
        time.sleep(2)

    return all_jobs


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def get_job_id(job: dict) -> str:
    return str(job.get("jobId") or job.get("id") or job.get("jobPostingId") or "")


def get_title(job: dict) -> str:
    return job.get("title") or job.get("jobTitle") or job.get("name") or "N/A"


def get_company(job: dict) -> str:
    return job.get("companyName") or job.get("company") or job.get("organization") or "N/A"


def get_location(job: dict) -> str:
    loc = job.get("location") or job.get("formattedLocation") or job.get("jobLocation") or ""
    if isinstance(loc, dict):
        return loc.get("name") or loc.get("city") or "N/A"
    return str(loc) if loc else "N/A"


def get_job_url(job: dict) -> str:
    url = job.get("jobUrl") or job.get("url") or job.get("link") or ""
    if url:
        return url
    job_id = get_job_id(job)
    if job_id:
        return f"https://www.linkedin.com/jobs/view/{job_id}/"
    return "N/A"


def is_netherlands_location(location: str) -> bool:
    """
    STRICT Netherlands check - returns True ONLY if location is in Netherlands.
    Uses comprehensive list of Dutch cities, regions, and indicators.
    """
    if not location or location == "N/A" or location == "n/a":
        return False

    loc_lower = location.lower().strip()

    # Check for non-Netherlands indicators first (reject immediately)
    for indicator in NON_NETHERLANDS_INDICATORS:
        if indicator in loc_lower:
            return False

    # Check for Netherlands country indicators
    if "netherlands" in loc_lower or "nederland" in loc_lower or "holland" in loc_lower:
        return True

    # Check for Dutch cities
    for city in NETHERLANDS_CITIES:
        if city in loc_lower:
            return True

    # Check for Dutch regions/provinces
    for region in NETHERLANDS_REGIONS:
        if region in loc_lower:
            return True

    # Check for Dutch postal code pattern (4 digits followed by 2 letters)
    # e.g., "1012 AB", "1077 XV"
    postal_pattern = r'\b\d{4}\s*[A-Za-z]{2}\b'
    if re.search(postal_pattern, location):
        return True

    # Check for "NL" country code
    if re.search(r'\bnl\b', loc_lower):
        return True

    return False


def filter_netherlands_only(jobs: list[dict]) -> tuple[list[dict], list[dict]]:
    """
    Filter jobs to keep ONLY those in Netherlands.
    Returns (netherlands_jobs, non_netherlands_jobs)
    """
    netherlands_jobs = []
    non_netherlands_jobs = []
    removed_locations = []

    for job in jobs:
        location = get_location(job)
        if is_netherlands_location(location):
            netherlands_jobs.append(job)
        else:
            non_netherlands_jobs.append(job)
            if location not in removed_locations[:10] and location != "N/A":
                removed_locations.append(location)

    if removed_locations:
        print(f"\n  🗑️ Removed {len(non_netherlands_jobs)} non-Netherlands jobs")
        print(f"     Examples: {', '.join(removed_locations[:5])}")

    return netherlands_jobs, non_netherlands_jobs


def merge_and_deduplicate(jobs: list[dict]) -> list[dict]:
    """Remove duplicate jobs and combine keywords"""
    seen = {}
    for job in jobs:
        job_id = get_job_id(job)

        if job_id:
            key = f"{job.get('_source', 'linkedin')}|{job_id}"
        else:
            title = get_title(job).lower()
            company = get_company(job).lower()
            key = f"{title}|{company}"

        if key in seen:
            keywords = seen[key].get("keywords_matched", [])
            if job.get("keyword") not in keywords:
                keywords.append(job.get("keyword", "unknown"))
            seen[key]["keywords_matched"] = keywords
        else:
            job_copy = dict(job)
            job_copy["keywords_matched"] = [job.get("keyword", "unknown")]
            seen[key] = job_copy

    return list(seen.values())


# ─────────────────────────────────────────────
#  EXCEL EXPORT (All jobs are Netherlands-only)
# ─────────────────────────────────────────────

HEADER = [
    "Application Status", "Source", "Job Title", "Company", "Location",
    "Keywords Matched", "Job URL"
]

COLOR_HEADER_BG = "102C53"
COLOR_HEADER_FG = "FFFFFF"
COLOR_NETHERLANDS_HIGHLIGHT = "FFA500"  # Orange for Netherlands! 🇳🇱
COLOR_ROW_EVEN = "F5F5F5"

THIN = Side(style="thin", color="AAAAAA")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)


def export_to_excel(jobs: list[dict], filename: Path) -> str:
    """Export jobs to Excel - all jobs are Netherlands-only, highlighted in ORANGE"""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = RUN_SHEET_NAME[:31]

    ws.append(HEADER)

    for job in jobs:
        row = [
            "",  # Application Status (manual entry)
            job.get("_source_label", "LinkedIn"),
            get_title(job),
            get_company(job),
            get_location(job),
            ", ".join(job.get("keywords_matched", [])),
            get_job_url(job),
        ]
        ws.append(row)

    # Style header row
    for cell in ws[1]:
        cell.font = Font(bold=True, color=COLOR_HEADER_FG, size=11)
        cell.fill = PatternFill("solid", fgColor=COLOR_HEADER_BG)
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = BORDER
    ws.row_dimensions[1].height = 30

    # Style data rows - ALL highlighted in orange (Netherlands color!)
    for row_idx in range(2, ws.max_row + 1):
        for col_idx in range(1, ws.max_column + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.border = BORDER
            cell.alignment = Alignment(vertical="top", wrap_text=True)
            cell.fill = PatternFill("solid", fgColor=COLOR_NETHERLANDS_HIGHLIGHT)

            # Make URL column blue and underlined
            if col_idx == 7:  # Job URL column
                cell.font = Font(color="0563C1", underline="single")

        ws.row_dimensions[row_idx].height = 50

    # Set column widths
    widths = [18, 12, 45, 35, 35, 35, 55]
    for i, width in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = width

    ws.freeze_panes = "A2"

    # Add summary at the bottom
    summary_row = ws.max_row + 2
    summary_cell = ws.cell(row=summary_row, column=1)
    summary_cell.value = f"📊 SUMMARY: {len(jobs)} Netherlands-only jobs (ALL highlighted in ORANGE 🇳🇱)"
    summary_cell.font = Font(bold=True, size=10)
    ws.merge_cells(start_row=summary_row, start_column=1, end_row=summary_row, end_column=4)

    wb.save(filename)
    return str(filename)


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────

def main():
    run_started = time.perf_counter()

    # Check token
    if not APIFY_API_TOKEN or APIFY_API_TOKEN == TOKEN_PLACEHOLDER:
        print("❌ Please set APIFY_API_TOKEN in .env file")
        print("   Create .env with: APIFY_API_TOKEN=your_token_here")
        return

    # Validate token
    test_url = f"https://api.apify.com/v2/acts?token={APIFY_API_TOKEN}"
    try:
        test_response = requests.get(test_url, timeout=10)
        if test_response.status_code == 200:
            print("✅ Apify token validated")
        else:
            print(f"❌ Invalid Apify token! Status: {test_response.status_code}")
            return
    except Exception as e:
        print(f"❌ Could not validate token: {e}")
        return

    # Run searches
    all_jobs = run_all_searches()

    if not all_jobs:
        print("\n⚠️ No jobs found!")
        return

    print(f"\n📊 Total jobs collected: {len(all_jobs)}")

    # Deduplicate
    print("🔄 Deduplicating results...")
    unique_jobs = merge_and_deduplicate(all_jobs)
    print(f"   → {len(unique_jobs)} unique job(s)")

    # Filter to NETHERLANDS ONLY
    print("\n🇳🇱 Filtering to Netherlands-only jobs...")
    netherlands_jobs, non_netherlands_jobs = filter_netherlands_only(unique_jobs)
    print(f"   → {len(netherlands_jobs)} Netherlands-only job(s)")

    if non_netherlands_jobs:
        print(f"   → {len(non_netherlands_jobs)} non-Netherlands job(s) removed")

    # Export to Excel (all Netherlands jobs, all highlighted in orange)
    if netherlands_jobs:
        output_path = export_to_excel(netherlands_jobs, EXCEL_OUTPUT_FILE)
    else:
        print("\n❌ No Netherlands jobs found!")
        print("   Try adding more Netherlands-specific keywords or adjusting search filters.")
        return

    # Final summary
    print("\n" + "=" * 60)
    print(f"  ✅ SCRAPING COMPLETE!")
    print(f"  📊 Total unique jobs found: {len(unique_jobs)}")
    print(f"  🇳🇱 Netherlands-only jobs: {len(netherlands_jobs)} (ALL highlighted in ORANGE)")
    if non_netherlands_jobs:
        print(f"  🗑️ Non-Netherlands jobs removed: {len(non_netherlands_jobs)}")
    print(f"  📁 Excel file: {output_path}")
    print(f"  ⏱️ Runtime: {time.perf_counter() - run_started:.1f} seconds")
    print("=" * 60)

    if len(netherlands_jobs) < 10:
        print(f"\n💡 Found only {len(netherlands_jobs)} Netherlands jobs. Consider:")
        print("   • Adding more Netherlands-specific keywords")
        print("   • Removing the 24-hour filter (PUBLISHED_AT)")
        print("   • Increasing MAX_RESULTS_PER_SEARCH")


if __name__ == "__main__":
    main()