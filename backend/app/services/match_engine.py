"""
Job Match Engine - AI-powered candidate-job matching
"""

from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

class JobMatchEngine:
    """Match candidates to jobs using AI and NLP"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.skill_keywords = {
            'gis': ['gis', 'arcgis', 'qgis', 'postgis', 'geospatial', 'mapping'],
            'programming': ['python', 'sql', 'javascript', 'r', 'java', 'c++'],
            'remote_sensing': ['remote sensing', 'satellite', 'lidar', 'hyperspectral'],
            'surveying': ['gnss', 'gps', 'total station', 'topography', 'survey'],
            'data_analysis': ['data analysis', 'machine learning', 'statistics', 'analytics']
        }
    
    def calculate_match_score(
        self,
        candidate: Dict[str, Any],
        job: Dict[str, Any],
        weights: Optional[Dict[str, float]] = None
    ) -> float:
        """Calculate match score between candidate and job"""
        
        if weights is None:
            weights = {
                'skills': 0.35,
                'experience': 0.25,
                'location': 0.15,
                'education': 0.15,
                'language': 0.10
            }
        
        scores = {}
        
        # 1. Skills Match
        scores['skills'] = self._calculate_skills_score(candidate, job)
        
        # 2. Experience Match
        scores['experience'] = self._calculate_experience_score(candidate, job)
        
        # 3. Location Match
        scores['location'] = self._calculate_location_score(candidate, job)
        
        # 4. Education Match
        scores['education'] = self._calculate_education_score(candidate, job)
        
        # 5. Language Match
        scores['language'] = self._calculate_language_score(candidate, job)
        
        # Calculate weighted total
        total_score = sum(weights[k] * scores[k] for k in weights.keys())
        
        return round(total_score * 100, 2)
    
    def _calculate_skills_score(self, candidate: Dict, job: Dict) -> float:
        """Calculate skills match using TF-IDF and keyword matching"""
        candidate_skills = candidate.get('skills', [])
        job_skills = job.get('skills', [])
        
        if not candidate_skills or not job_skills:
            return 0.3
        
        # Convert to strings for TF-IDF
        candidate_text = ' '.join(candidate_skills)
        job_text = ' '.join(job_skills)
        
        try:
            vectors = self.vectorizer.fit_transform([candidate_text, job_text])
            similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
            return max(0, min(1, similarity))
        except:
            # Fallback to keyword matching
            matched = sum(1 for skill in job_skills if skill.lower() in candidate_text.lower())
            return matched / len(job_skills) if job_skills else 0
    
    def _calculate_experience_score(self, candidate: Dict, job: Dict) -> float:
        """Calculate experience match based on years"""
        candidate_years = candidate.get('years_experience', 0)
        job_required = job.get('experience_level', 'mid')
        
        level_mapping = {
            'entry': 0,
            'junior': 2,
            'mid': 4,
            'senior': 7,
            'lead': 10
        }
        
        required_years = level_mapping.get(job_required, 4)
        
        if candidate_years >= required_years:
            return 1.0
        elif candidate_years >= required_years * 0.7:
            return 0.7
        elif candidate_years >= required_years * 0.5:
            return 0.5
        else:
            return 0.3
    
    def _calculate_location_score(self, candidate: Dict, job: Dict) -> float:
        """Calculate location proximity score"""
        # Simplified - would use PostGIS for actual distance
        candidate_city = candidate.get('city', '').lower()
        job_city = job.get('city', '').lower()
        
        if candidate_city and job_city:
            if candidate_city == job_city:
                return 1.0
            elif candidate_city in job_city or job_city in candidate_city:
                return 0.8
        
        # Check if job is remote
        if job.get('is_remote', False):
            return 1.0
        
        return 0.5
    
    def _calculate_education_score(self, candidate: Dict, job: Dict) -> float:
        """Calculate education match"""
        # Simplified education check
        education_levels = {
            'high_school': 0.3,
            'bachelor': 0.7,
            'master': 0.9,
            'phd': 1.0
        }
        
        candidate_education = candidate.get('highest_degree', '').lower()
        job_required = job.get('required_education', '').lower()
        
        if not candidate_education:
            return 0.5
        
        if 'phd' in candidate_education:
            return 1.0
        elif 'master' in candidate_education or 'msc' in candidate_education:
            return 0.9
        elif 'bachelor' in candidate_education or 'bsc' in candidate_education:
            return 0.7
        else:
            return 0.5
    
    def _calculate_language_score(self, candidate: Dict, job: Dict) -> float:
        """Calculate language match"""
        candidate_languages = candidate.get('languages', [])
        job_languages = job.get('languages', ['English'])
        
        if not candidate_languages:
            return 0.5
        
        # Count how many required languages are spoken
        matched = sum(1 for lang in job_languages 
                     if any(lang.lower() in cl['language'].lower() for cl in candidate_languages))
        
        if job_languages:
            return matched / len(job_languages)
        return 0.7
    
    def find_matching_candidates(
        self,
        job: Dict[str, Any],
        candidates: List[Dict[str, Any]],
        limit: int = 10,
        min_score: float = 50
    ) -> List[Dict[str, Any]]:
        """Find top matching candidates for a job"""
        results = []
        
        for candidate in candidates:
            score = self.calculate_match_score(candidate, job)
            if score >= min_score:
                results.append({
                    'candidate': candidate,
                    'match_score': score
                })
        
        results.sort(key=lambda x: x['match_score'], reverse=True)
        return results[:limit]
    
    def extract_skills_from_text(self, text: str) -> List[str]:
        """Extract skills from text using keyword matching"""
        skills = []
        text_lower = text.lower()
        
        for category, keywords in self.skill_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    skills.append(keyword.title())
        
        return list(set(skills))
