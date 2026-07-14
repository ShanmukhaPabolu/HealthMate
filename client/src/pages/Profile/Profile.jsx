import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { triggerToast } = useContext(NotificationContext);
  const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('personal');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  // Health Profile states
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');

  // EHR states
  const [vaccines, setVaccines] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);

  // New EHR input states
  const [newVaccineName, setNewVaccineName] = useState('');
  const [newVaccineDate, setNewVaccineDate] = useState('');
  const [newVaccineBatch, setNewVaccineBatch] = useState('');

  const [newReportName, setNewReportName] = useState('');
  const [newReportDate, setNewReportDate] = useState('');
  const [newReportSummary, setNewReportSummary] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Disputes states
  const [disputesList, setDisputesList] = useState([]);
  const [disputeCategory, setDisputeCategory] = useState('Billing');
  const [disputeDescription, setDisputeDescription] = useState('');

  const fetchDisputes = async () => {
    try {
      const response = await api.get('/disputes');
      if (response.data.success) {
        setDisputesList(response.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'disputes') {
      fetchDisputes();
    }
  }, [activeTab]);

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    if (!disputeDescription.trim()) return;
    try {
      const response = await api.post('/disputes', {
        category: disputeCategory,
        description: disputeDescription
      });

      if (response.data.success) {
        triggerToast('Dispute ticket registered successfully!', 'success');
        setDisputeDescription('');
        fetchDisputes();
      }
    } catch (err) {
      triggerToast('Failed to lodge dispute ticket.', 'error');
    }
  };

  // Load profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        if (response.data.success) {
          const profile = response.data.data;
          setName(profile.name || '');
          setPhone(profile.phone || '');
          setGender(profile.gender || '');
          setAddress(profile.address || '');
          if (profile.dob) {
            setDob(new Date(profile.dob).toISOString().split('T')[0]);
          }

          if (profile.healthProfile) {
            setBloodGroup(profile.healthProfile.bloodGroup || '');
            setAllergies(profile.healthProfile.allergies || '');
            setChronicConditions(profile.healthProfile.chronicConditions || '');
            
            if (profile.healthProfile.emergencyContact) {
              setEmergencyName(profile.healthProfile.emergencyContact.name || '');
              setEmergencyPhone(profile.healthProfile.emergencyContact.phone || '');
              setEmergencyRelationship(profile.healthProfile.emergencyContact.relationship || '');
            }

            if (profile.healthProfile.insurance) {
              setInsuranceProvider(profile.healthProfile.insurance.provider || '');
              setInsurancePolicyNumber(profile.healthProfile.insurance.policyNumber || '');
            }

            setVaccines(profile.healthProfile.vaccines || []);
            setLabReports(profile.healthProfile.labReports || []);
            setMedicalHistory(profile.healthProfile.medicalHistory || []);
          }
        }
      } catch (err) {
        console.error('Failed to load profile details', err);
        triggerToast('Failed to load profile details.', 'error');
      }
    };

    fetchProfile();
  }, []);


  // EHR log additions
  const handleAddVaccine = async (e) => {
    e.preventDefault();
    if (!newVaccineName) return;
    const newV = {
      vaccineName: newVaccineName,
      dateAdministered: newVaccineDate || new Date(),
      batchNumber: newVaccineBatch
    };
    const updated = [...vaccines, newV];
    setVaccines(updated);
    try {
      await api.post('/user/profile', {
        healthProfile: {
          bloodGroup, allergies, chronicConditions,
          emergencyContact: { name: emergencyName, phone: emergencyPhone, relationship: emergencyRelationship },
          insurance: { provider: insuranceProvider, policyNumber: insurancePolicyNumber },
          vaccines: updated,
          labReports,
          medicalHistory
        }
      });
      triggerToast('Vaccine entry added!', 'success');
      setNewVaccineName('');
      setNewVaccineDate('');
      setNewVaccineBatch('');
    } catch (err) {
      triggerToast('Failed to add vaccine log.', 'error');
    }
  };

  const handleAddLabReport = async (e) => {
    e.preventDefault();
    if (!newReportName) return;
    const newL = {
      reportName: newReportName,
      testDate: newReportDate || new Date(),
      resultSummary: newReportSummary
    };
    const updated = [...labReports, newL];
    setLabReports(updated);
    try {
      await api.post('/user/profile', {
        healthProfile: {
          bloodGroup, allergies, chronicConditions,
          emergencyContact: { name: emergencyName, phone: emergencyPhone, relationship: emergencyRelationship },
          insurance: { provider: insuranceProvider, policyNumber: insurancePolicyNumber },
          vaccines,
          labReports: updated,
          medicalHistory
        }
      });
      triggerToast('Lab report entry added!', 'success');
      setNewReportName('');
      setNewReportDate('');
      setNewReportSummary('');
    } catch (err) {
      triggerToast('Failed to add lab report.', 'error');
    }
  };

  // Submit Profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/profile', {
        name,
        phone,
        gender,
        dob,
        address,
        healthProfile: {
          bloodGroup,
          allergies,
          chronicConditions,
          emergencyContact: {
            name: emergencyName,
            phone: emergencyPhone,
            relationship: emergencyRelationship
          },
          insurance: {
            provider: insuranceProvider,
            policyNumber: insurancePolicyNumber
          }
        }
      });

      if (response.data.success) {
        triggerToast('Profile updated successfully!', 'success');
        // Update user context name if changed
        setUser(prev => ({ ...prev, name }));
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    }
  };

  // Submit Password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return triggerToast('New passwords do not match!', 'error');
    }

    try {
      const response = await api.put('/user/change-password', {
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        triggerToast('Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Password update failed.', 'error');
    }
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
                              
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div className="container">
          <div className="profile-wrapper" style={{
            display: 'grid',
            gridTemplateColumns: '250px 1fr',
            gap: '40px',
            backgroundColor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            {/* Tabs Sidebar */}
            <div className="profile-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button
                className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
                style={{
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: activeTab === 'personal' ? 'var(--primary-gradient)' : 'transparent',
                  color: activeTab === 'personal' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <i className="fas fa-user-circle" style={{ marginRight: '10px' }}></i> Personal Info
              </button>
              
              <button
                className={`tab-btn ${activeTab === 'disputes' ? 'active' : ''}`}
                onClick={() => setActiveTab('disputes')}
                style={{
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: activeTab === 'disputes' ? 'var(--primary-gradient)' : 'transparent',
                  color: activeTab === 'disputes' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i> Help & Disputes
              </button>
              <button
                className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`}
                onClick={() => setActiveTab('health')}
                style={{
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: activeTab === 'health' ? 'var(--primary-gradient)' : 'transparent',
                  color: activeTab === 'health' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <i className="fas fa-file-medical-alt" style={{ marginRight: '10px' }}></i> Health Profile
              </button>
              <button
                className={`tab-btn ${activeTab === 'ehr' ? 'active' : ''}`}
                onClick={() => setActiveTab('ehr')}
                style={{
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: activeTab === 'ehr' ? 'var(--primary-gradient)' : 'transparent',
                  color: activeTab === 'ehr' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <i className="fas fa-notes-medical" style={{ marginRight: '10px' }}></i> EHR Records
              </button>
              <button
                className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
                style={{
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: activeTab === 'security' ? 'var(--primary-gradient)' : 'transparent',
                  color: activeTab === 'security' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <i className="fas fa-lock" style={{ marginRight: '10px' }}></i> Password & Security
              </button>
            </div>

            {/* Profile Forms details */}
            <div className="profile-content">
              {activeTab === 'personal' && (
                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Personal Information</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="input-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="input-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Residential Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%', minHeight: '100px' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Save Details
                  </button>
                </form>
              )}

              {activeTab === 'health' && (
                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Health Profile Summary</h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="input-group">
                      <label>Blood Group</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Allergies (comma separated)</label>
                      <input
                        type="text"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="e.g. Peanuts, Penicillin"
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Chronic Medical Conditions</label>
                    <textarea
                      value={chronicConditions}
                      onChange={(e) => setChronicConditions(e.target.value)}
                      placeholder="e.g. Hypertension, Diabetes, Asthma"
                      style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%', minHeight: '80px' }}
                    />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>Emergency Contact</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div className="input-group">
                      <label>Contact Name</label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Contact Phone</label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Relationship</label>
                      <input
                        type="text"
                        value={emergencyRelationship}
                        onChange={(e) => setEmergencyRelationship(e.target.value)}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>Insurance Details</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="input-group">
                      <label>Insurance Provider</label>
                      <input
                        type="text"
                        value={insuranceProvider}
                        onChange={(e) => setInsuranceProvider(e.target.value)}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Policy Number</label>
                      <input
                        type="text"
                        value={insurancePolicyNumber}
                        onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: '100%' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Update Health Profile
                  </button>
                </form>
              )}

              {activeTab === 'security' && (
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Update Password</h2>
                  
                  <div className="input-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                    />
                  </div>

                  <div className="input-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                    />
                  </div>

                  <div className="input-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Update Password
                  </button>
                </form>
              )}

              {activeTab === 'disputes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Lodge Support & Dispute Ticket</h2>
                  
                  <form onSubmit={handleDisputeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '30px' }}>
                    <div className="input-group">
                      <label>Dispute Category</label>
                      <select
                        value={disputeCategory}
                        onChange={(e) => setDisputeCategory(e.target.value)}
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%', outline: 'none' }}
                      >
                        <option value="Billing">Billing issue</option>
                        <option value="Cancellation">Cancellation issue</option>
                        <option value="Medical Quality">Medical Quality</option>
                        <option value="Behavior">Staff/Doctor behavior</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Detail Description</label>
                      <textarea
                        value={disputeDescription}
                        onChange={(e) => setDisputeDescription(e.target.value)}
                        placeholder="Provide details about the issue..."
                        required
                        style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%', minHeight: '100px', outline: 'none' }}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                      Submit Dispute Ticket
                    </button>
                  </form>

                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '15px' }}>Your Dispute History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {disputesList.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No dispute tickets logged.</p>
                      ) : (
                        disputesList.map((dis) => (
                          <div key={dis._id} style={{ padding: '20px', border: '1px solid var(--border-subtle)', borderRadius: '16px', background: 'rgba(255,255,255,0.4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <span style={{ fontWeight: '700' }}>Category: {dis.category}</span>
                              <span style={{
                                padding: '3px 10px',
                                borderRadius: '50px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                background: dis.status === 'resolved' ? 'rgba(40,167,69,0.1)' : 'rgba(253,126,20,0.1)',
                                color: dis.status === 'resolved' ? 'var(--accent-green)' : 'var(--accent-orange)',
                                textTransform: 'uppercase'
                              }}>{dis.status}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '10px' }}>{dis.description}</p>
                            {dis.status === 'resolved' && (
                              <div style={{ padding: '10px', background: 'rgba(40,167,69,0.05)', border: '1px solid rgba(40,167,69,0.1)', borderRadius: '8px', fontSize: '12.5px' }}>
                                <strong>Admin resolution notes:</strong> {dis.resolutionNotes}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ehr' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Electronic Health Records (EHR)</h2>

                  {/* Vaccines logs */}
                  <div style={{ padding: '25px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '15px' }}><i className="fas fa-syringe" style={{ marginRight: '10px', color: 'var(--accent-color)' }} />Vaccination Log</h3>
                    
                    <form onSubmit={handleAddVaccine} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '25px' }} className="ehr-form">
                      <input
                        type="text"
                        value={newVaccineName}
                        onChange={(e) => setNewVaccineName(e.target.value)}
                        placeholder="Vaccine Name (e.g. Covid-19, Hep B)"
                        required
                        style={{ flex: 2, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                      />
                      <input
                        type="date"
                        value={newVaccineDate}
                        onChange={(e) => setNewVaccineDate(e.target.value)}
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                      />
                      <input
                        type="text"
                        value={newVaccineBatch}
                        onChange={(e) => setNewVaccineBatch(e.target.value)}
                        placeholder="Batch/Lot Number"
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '8px' }}>
                        Log Vaccine
                      </button>
                    </form>

                    {vaccines.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>No vaccinations logged.</p>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                        {vaccines.map((v, idx) => (
                          <div key={idx} style={{ padding: '15px', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                            <h4 style={{ fontWeight: 'bold', fontSize: '14.5px', marginBottom: '5px' }}>{v.vaccineName}</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', marginBottom: '3px' }}>Administered: {new Date(v.dateAdministered).toLocaleDateString()}</p>
                            {v.batchNumber && <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Batch: {v.batchNumber}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Lab reports logs */}
                  <div style={{ padding: '25px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '15px' }}><i className="fas fa-vials" style={{ marginRight: '10px', color: 'var(--accent-blue)' }} />Lab & Medical Reports</h3>

                    <form onSubmit={handleAddLabReport} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }} className="ehr-form">
                      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          value={newReportName}
                          onChange={(e) => setNewReportName(e.target.value)}
                          placeholder="Report Name (e.g. Lipid Profile, Blood Count)"
                          required
                          style={{ flex: 2, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                        />
                        <input
                          type="date"
                          value={newReportDate}
                          onChange={(e) => setNewReportDate(e.target.value)}
                          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                        />
                      </div>
                      <textarea
                        value={newReportSummary}
                        onChange={(e) => setNewReportSummary(e.target.value)}
                        placeholder="Result Summary / Critical Notes..."
                        style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', minHeight: '80px' }}
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', alignSelf: 'flex-start' }}>
                        Log Lab Report
                      </button>
                    </form>

                    {labReports.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>No lab reports logged.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {labReports.map((r, idx) => (
                          <div key={idx} style={{ padding: '15px', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h4 style={{ fontWeight: 'bold', fontSize: '14.5px', marginBottom: '4px' }}>{r.reportName}</h4>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', marginBottom: '4px' }}>Test Date: {new Date(r.testDate).toLocaleDateString()}</p>
                              {r.resultSummary && <p style={{ color: 'var(--text-muted)', fontSize: '12px', background: 'rgba(0,0,0,0.02)', padding: '6px 10px', borderRadius: '6px' }}>{r.resultSummary}</p>}
                            </div>
                            <i className="fas fa-file-medical" style={{ fontSize: '1.8rem', color: 'var(--text-muted)' }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Profile;
