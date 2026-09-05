import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, TextField, Button,
  Stepper, Step, StepLabel, Alert, CircularProgress,
  Grid, Chip, IconButton, Divider, MenuItem, LinearProgress,
  Card, CardContent, Avatar, Fab
} from '@mui/material';
import {
  Add, Delete, CloudUpload, School, Work, 
  Build, Language, Description, CheckCircle,
  ArrowBack, Send
} from '@mui/icons-material';
import { jobService } from '../services/api';

const steps = ['Personal Information', 'Education & Experience', 'Skills & Documents', 'Review & Submit'];

export const ApplyPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Italy',
    current_title: '',
    years_experience: 0,
    summary: '',
    cover_letter_text: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    education: [],
    work_experience: [],
    skills: [],
    certifications: [],
    languages: [],
  });
  const [errors, setErrors] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const data = await jobService.getJob(jobId || '');
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (field: string, index: number, key: string, value: any) => {
    const updated = [...formData[field]];
    updated[index][key] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const handleAddEntry = (field: string, template: any) => {
    setFormData({ 
      ...formData, 
      [field]: [...formData[field], template] 
    });
  };

  const handleRemoveEntry = (field: string, index: number) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData({ ...formData, [field]: updated });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const validateStep = (step: number) => {
    const newErrors: any = {};
    
    if (step === 0) {
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.last_name) newErrors.last_name = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
    }
    
    if (step === 1) {
      if (formData.education.length === 0) {
        newErrors.education = 'At least one education entry is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/applications/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => navigate('/applications'), 3000);
      } else {
        const error = await response.json();
        setErrors({ submit: error.detail || 'Failed to submit application' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderEducation = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Education History</Typography>
      {formData.education.map((edu: any, index: number) => (
        <Card key={index} sx={{ mb: 2, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Institution"
                value={edu.institution || ''}
                onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Degree"
                value={edu.degree || ''}
                onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Field of Study"
                value={edu.field || ''}
                onChange={(e) => handleArrayChange('education', index, 'field', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="month"
                value={edu.start_date || ''}
                onChange={(e) => handleArrayChange('education', index, 'start_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="month"
                value={edu.end_date || ''}
                onChange={(e) => handleArrayChange('education', index, 'end_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <IconButton onClick={() => handleRemoveEntry('education', index)} color="error">
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </Card>
      ))}
      <Button
        startIcon={<Add />}
        onClick={() => handleAddEntry('education', { institution: '', degree: '', field: '', start_date: '', end_date: '' })}
      >
        Add Education
      </Button>
    </Box>
  );

  const renderWorkExperience = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Work Experience</Typography>
      {formData.work_experience.map((exp: any, index: number) => (
        <Card key={index} sx={{ mb: 2, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Company"
                value={exp.company || ''}
                onChange={(e) => handleArrayChange('work_experience', index, 'company', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Job Title"
                value={exp.title || ''}
                onChange={(e) => handleArrayChange('work_experience', index, 'title', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="month"
                value={exp.start_date || ''}
                onChange={(e) => handleArrayChange('work_experience', index, 'start_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="month"
                value={exp.end_date || ''}
                onChange={(e) => handleArrayChange('work_experience', index, 'end_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={exp.description || ''}
                onChange={(e) => handleArrayChange('work_experience', index, 'description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <IconButton onClick={() => handleRemoveEntry('work_experience', index)} color="error">
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </Card>
      ))}
      <Button
        startIcon={<Add />}
        onClick={() => handleAddEntry('work_experience', { company: '', title: '', start_date: '', end_date: '', description: '' })}
      >
        Add Work Experience
      </Button>
    </Box>
  );

  const renderSkills = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Skills</Typography>
      <TextField
        fullWidth
        label="Skills (comma separated)"
        value={formData.skills.join(', ')}
        onChange={(e) => {
          const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
          setFormData({ ...formData, skills });
        }}
        helperText="Enter your skills separated by commas"
      />
      
      <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {formData.skills.map((skill: string, index: number) => (
          <Chip
            key={index}
            label={skill}
            onDelete={() => {
              const updated = formData.skills.filter((s: string) => s !== skill);
              setFormData({ ...formData, skills: updated });
            }}
          />
        ))}
      </Box>
    </Box>
  );

  const renderCertifications = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Certifications</Typography>
      {formData.certifications.map((cert: any, index: number) => (
        <Card key={index} sx={{ mb: 2, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Certification Name"
                value={cert.name || ''}
                onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Issuer"
                value={cert.issuer || ''}
                onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <IconButton onClick={() => handleRemoveEntry('certifications', index)} color="error">
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </Card>
      ))}
      <Button
        startIcon={<Add />}
        onClick={() => handleAddEntry('certifications', { name: '', issuer: '' })}
      >
        Add Certification
      </Button>
    </Box>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                error={!!errors.first_name}
                helperText={errors.first_name}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                error={!!errors.last_name}
                helperText={errors.last_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Current Job Title"
                name="current_title"
                value={formData.current_title}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Professional Summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <>
            {renderEducation()}
            {renderWorkExperience()}
          </>
        );
      case 2:
        return (
          <>
            {renderSkills()}
            {renderCertifications()}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Documents</Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{ mr: 2 }}
              >
                Upload CV
                <input type="file" hidden onChange={handleFileUpload} />
              </Button>
              {selectedFile && (
                <Chip label={selectedFile.name} onDelete={() => setSelectedFile(null)} />
              )}
              {uploadProgress > 0 && (
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 2 }} />
              )}
              <TextField
                fullWidth
                label="Cover Letter"
                name="cover_letter_text"
                value={formData.cover_letter_text}
                onChange={handleInputChange}
                multiline
                rows={6}
                sx={{ mt: 2 }}
                placeholder="Write your cover letter here..."
              />
              <TextField
                fullWidth
                label="Portfolio URL"
                name="portfolio_url"
                value={formData.portfolio_url}
                onChange={handleInputChange}
                sx={{ mt: 2 }}
                placeholder="https://your-portfolio.com"
              />
              <TextField
                fullWidth
                label="LinkedIn URL"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleInputChange}
                sx={{ mt: 2 }}
                placeholder="https://linkedin.com/in/your-profile"
              />
            </Box>
          </>
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: '#22c55e', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Review Your Application
            </Typography>
            <Typography variant="body1" sx={{ color: '#4a5a6a', mb: 3 }}>
              Please review all your information before submitting.
            </Typography>
            <Paper sx={{ p: 3, textAlign: 'left', bgcolor: '#f8fafc' }}>
              <Typography><strong>Name:</strong> {formData.first_name} {formData.last_name}</Typography>
              <Typography><strong>Email:</strong> {formData.email}</Typography>
              <Typography><strong>Current Title:</strong> {formData.current_title || 'Not specified'}</Typography>
              <Typography><strong>Skills:</strong> {formData.skills.join(', ') || 'None specified'}</Typography>
              <Typography><strong>Education:</strong> {formData.education.length} entries</Typography>
              <Typography><strong>Work Experience:</strong> {formData.work_experience.length} entries</Typography>
            </Paper>
          </Box>
        );
      default:
        return null;
    }
  };

  if (!job) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 100, color: '#22c55e', mb: 3 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Application Submitted! 🎉
        </Typography>
        <Typography variant="body1" sx={{ color: '#4a5a6a', mb: 4 }}>
          Your application for {job.title} at {job.company_name} has been sent successfully.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/applications')}>
          View My Applications
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(`/jobs/${jobId}`)}
        sx={{ mb: 3 }}
      >
        Back to Job
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Apply for {job.title}
      </Typography>
      <Typography variant="body1" sx={{ color: '#4a5a6a', mb: 4 }}>
        {job.company_name} • {job.city}
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)',
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Application'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)',
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};
