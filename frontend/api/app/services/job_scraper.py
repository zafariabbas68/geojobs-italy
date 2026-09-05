"""
LinkedIn Job Scraper Service
"""

import os
import json
import requests
from typing import List, Dict, Any
from datetime import datetime
from app.models.job import Job, JobType, ExperienceLevel, JobStatus
from app.models.company import Company
from app.core.database import SessionLocal

class LinkedInJobScraperService:
    def __init__(self):
        self.apify_token = os.getenv('APIFY_API_TOKEN')
        self.actor_id = "curious_coder~linkedin-jobs-scraper"
        self.keywords = [
            "GIS Italy",
            "Geospatial Italy",
            "Remote Sensing Italy",
            "GIS Analyst Italy",
        ]
    
    def scrape_jobs(self) -> List[Dict[str, Any]]:
        """Scrape jobs from LinkedIn using Apify"""
        if not self.apify_token:
            print("⚠️ APIFY_API_TOKEN not set. Please add it to .env")
            return []
        
        all_jobs = []
        
        for keyword in self.keywords:
            print(f"🔍 Scraping: {keyword}")
            
            try:
                search_url = f"https://www.linkedin.com/jobs/search/?keywords={keyword.replace(' ', '+')}&location=Italy"
                
                url = f"https://api.apify.com/v2/acts/{self.actor_id}/run-sync-get-dataset-items"
                params = {
                    "token": self.apify_token,
                    "timeout": 120,
                    "memory": 512,
                    "maxItems": 20,
                }
                
                payload = {
                    "urls": [search_url],
                    "count": 20,
                    "scrapeCompany": True,
                }
                
                response = requests.post(url, params=params, json=payload, timeout=180)
                
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list):
                        all_jobs.extend(data)
                        print(f"   ✓ Found {len(data)} jobs")
                    elif isinstance(data, dict) and "items" in data:
                        all_jobs.extend(data["items"])
                        print(f"   ✓ Found {len(data['items'])} jobs")
                else:
                    print(f"   ⚠ API error: {response.status_code}")
                    
            except Exception as e:
                print(f"   ❌ Error: {e}")
        
        return all_jobs
    
    def run(self):
        """Run the full scraping process"""
        print("🚀 Starting LinkedIn job scraping...")
        jobs = self.scrape_jobs()
        
        if jobs:
            print(f"📊 Scraped {len(jobs)} jobs total")
        else:
            print("⚠️ No jobs found")

if __name__ == "__main__":
    scraper = LinkedInJobScraperService()
    scraper.run()
