import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  Avatar,
  Tooltip,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Person,
  Work,
  Map,
  NotificationsActive,
  CheckCircle
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New GIS Developer job posted in Milan', read: false, time: '2 min ago' },
    { id: 2, message: 'Remote Sensing Specialist position updated', read: false, time: '15 min ago' },
    { id: 3, message: '3 new candidates applied to your job', read: true, time: '1 hour ago' },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!token);
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.first_name || 'User');
      } catch {
        setUserName('User');
      }
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
    // Mark all as read when opened
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    handleMenuClose();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" color="inherit" sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <Map sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0e2f44' }}>
                GeoJobs
                <Typography component="span" sx={{ color: '#1a5276', fontWeight: 700 }}>
                  Italy
                </Typography>
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button color="inherit" component={Link} to="/jobs" sx={{ color: '#4a5a6a' }}>
              <Work sx={{ mr: 0.5, fontSize: 20 }} />
              Jobs
            </Button>
            <Button color="inherit" component={Link} to="/candidates" sx={{ color: '#4a5a6a' }}>
              <Person sx={{ mr: 0.5, fontSize: 20 }} />
              Candidates
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="/post-job"
              sx={{
                background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)',
                ml: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #0e2f44 0%, #1a5276 100%)',
                },
              }}
            >
              Post a Job
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={handleNotificationOpen} sx={{ color: '#4a5a6a' }}>
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <Tooltip title="Account settings">
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: '#1a5276' }}>
                    {userName?.[0] || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{ borderColor: '#1a5276', color: '#1a5276' }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{ background: 'linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)' }}
                >
                  Register
                </Button>
              </Box>
            )}

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard">
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose} component={Link} to="/saved-jobs">
                Saved Jobs
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

            <Popover
              open={Boolean(notificationAnchor)}
              anchorEl={notificationAnchor}
              onClose={handleNotificationClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: { width: 360, maxHeight: 400, borderRadius: 2 }
              }}
            >
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {notifications.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No notifications" secondary="You're all caught up!" />
                  </ListItem>
                ) : (
                  notifications.map((notification) => (
                    <ListItem key={notification.id} sx={{ 
                      bgcolor: notification.read ? 'transparent' : '#f0f4f8',
                      '&:hover': { bgcolor: '#e8f0fe' }
                    }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle sx={{ fontSize: 16, color: notification.read ? '#4a5a6a' : '#22c55e' }} />
                            <Typography variant="body2">{notification.message}</Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: '#4a5a6a' }}>
                            {notification.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
              {notifications.length > 0 && (
                <Box sx={{ p: 1, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <Button size="small" sx={{ color: '#1a5276' }}>
                    Mark all as read
                  </Button>
                </Box>
              )}
            </Popover>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
