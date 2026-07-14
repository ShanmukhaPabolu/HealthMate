import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingScreen from '../../components/LoadingScreen';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { triggerToast } = useContext(NotificationContext);

    const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [consultationType, setConsultationType] = useState('offline');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  // Checkout Form fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Default mock slots if none set
  const timeSlots = (doctor && doctor.slots && doctor.slots.length > 0) ? doctor.slots : [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!bookingDate) return;
    const fetchBookedSlots = async () => {
      try {
        const response = await api.get(`/appointments/booked-slots?doctorId=${id}&date=${bookingDate}`);
        if (response.data.success) {
          setBookedSlots(response.data.bookedSlots || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookedSlots();
  }, [bookingDate, id]);

  const fetchDoctorDetails = async () => {
    try {
      const response = await api.get(`/doctors/${id}`);
      if (response.data.success) {
        setDoctor(response.data.data);
        setReviews(response.data.data.reviews || []);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to load doctor profile details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);


  // Submit booking directly and create appointment
  const handleProceedBooking = async (e) => {
    e.preventDefault();
    if (!bookingDate) return triggerToast('Please choose a consultation date.', 'error');
    if (!selectedSlot) return triggerToast('Please choose a time slot.', 'error');
    setProcessingPayment(true);

    try {
      // Prepare form data for Multer attachment upload compatibility
      const formData = new FormData();
      formData.append('doctorId', id);
      formData.append('date', bookingDate);
      formData.append('slot', selectedSlot);
      formData.append('symptoms', symptoms);
      formData.append('consultationType', consultationType);
      formData.append('amount', doctor.consultationFee);
      if (reportFile) {
        formData.append('report', reportFile);
      }

      const response = await api.post('/appointments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        triggerToast('Appointment booked successfully!', 'success');
        setBookingSuccessData(response.data.appointment);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Booking failed.', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Submit post consultation review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment) return;
    try {
      const response = await api.post('/reviews', {
        doctorId: id,
        rating: reviewRating,
        comment: reviewComment
      });

      if (response.data.success) {
        triggerToast('Review submitted successfully!', 'success');
        setReviewComment('');
        fetchDoctorDetails();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Review submission rejected (only completed patients can review).', 'error');
    }
  };

  if (loading) return <LoadingScreen />;
  if (!doctor) return <div style={{ padding: '100px', textAlign: 'center' }}>Doctor profile not found.</div>;

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
      
                              
      <Header />
      
      <main style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '60px' }}>
        <div className="container">
          
          {/* Main Info layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' }}>
            
            {/* Left detailed specs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                gap: '30px',
                alignItems: 'center'
              }}>
                <div style={{ width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', background: '#e9ecef', flexShrink: 0 }}>
                  <img
                    src={doctor.profilePhoto || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80'}
                    alt={doctor.user?.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '5px' }}>Dr. {doctor.user?.name}</h1>
                  <h3 style={{ color: 'var(--accent-color)', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>{doctor.specialization}</h3>
                  <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '14.5px' }}>
                    <span><i className="fas fa-graduation-cap"></i> {doctor.qualification}</span>
                    <span>•</span>
                    <span><i className="fas fa-briefcase"></i> {doctor.experience} Years Experience</span>
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '30px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '15px' }}>Professional Biography</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '15px' }}>{doctor.bio || "No biography provided by the specialist."}</p>
                
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '30px', marginBottom: '15px' }}>Hospital clinic info</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                  <i className="fas fa-hospital" style={{ marginRight: '10px', color: 'var(--accent-color)' }}></i> {doctor.hospital}
                </p>
              </div>

              {/* Patient Reviews Section */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '30px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px' }}>Patient Reviews ({reviews.length})</h3>

                {/* Submit review */}
                <form onSubmit={handleReviewSubmit} style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '25px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>Write a Review</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <span>Rating:</span>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your consultation details feedback..."
                      required
                      style={{ flex: 1, padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}>
                      Submit
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No reviews posted yet.</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev._id} style={{ padding: '15px', border: '1px solid var(--border-subtle)', borderRadius: '12px', background: 'rgba(255,255,255,0.4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '700' }}>{rev.patient?.name}</span>
                          <span style={{ color: '#FFC107' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Booking Sidebar */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(25px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)',
              position: 'sticky',
              top: '100px'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px' }}>Book Appointment</h3>
              
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent-color)', marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Fee:</span>
                <span>${doctor.consultationFee}</span>
              </div>

              {bookingSuccessData ? (
                /* SUCCESS CHECKOUT WORKFLOW VIEW */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'center' }}>
                  <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: 'var(--accent-green)', margin: '15px auto' }}></i>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Appointment Confirmed!</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                    Your appointment is successfully scheduled on <strong>{bookingSuccessData.date}</strong> at <strong>{bookingSuccessData.slot}</strong>.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    <a
                      href={`/api/appointments/${bookingSuccessData._id}/receipt?token=${localStorage.getItem('token')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ background: 'var(--secondary-gradient)', justifyContent: 'center' }}
                    >
                      <i className="fas fa-file-invoice-dollar"></i> Download Receipt PDF
                    </a>
                    
                    <button
                      onClick={() => {
                        setBookingSuccessData(null);
                        setBookingDate('');
                        setSelectedSlot('');
                        setReportFile(null);
                      }}
                      className="btn btn-secondary"
                    >
                      Book Another slot
                    </button>
                  </div>
                </div>
              ) : (
                /* CALENDAR FORM */
                <form onSubmit={handleProceedBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="input-group">
                    <label>Choose Consultation Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select Time Slot</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {timeSlots.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setSelectedSlot(slot)}
                            className="slot-btn"
                            style={{
                              padding: '10px',
                              borderRadius: '8px',
                              border: isSelected ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                              background: isBooked ? '#e9ecef' : isSelected ? 'var(--secondary-gradient)' : 'white',
                              color: isBooked ? 'var(--text-muted)' : isSelected ? 'white' : 'var(--text-secondary)',
                              fontWeight: '600',
                              fontSize: '13px',
                              cursor: isBooked ? 'not-allowed' : 'pointer',
                              textDecoration: isBooked ? 'line-through' : 'none'
                            }}
                          >
                            {slot} {isBooked && '(Booked)'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Consultation Type</label>
                    <select
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value)}
                      style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%', outline: 'none' }}
                    >
                      <option value="offline">Offline Visit (Physical)</option>
                      <option value="online">Online Call (Virtual)</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Describe Symptoms</label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe your health symptoms..."
                      required
                      style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', width: '100%', minHeight: '80px', outline: 'none' }}
                    />
                  </div>

                  <div className="input-group">
                    <label>Attach Medical Report (Optional)</label>
                    <input
                      type="file"
                      onChange={(e) => setReportFile(e.target.files[0])}
                      accept=".pdf,image/*"
                      style={{ padding: '10px', width: '100%' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={processingPayment}>
                    {processingPayment ? 'Booking...' : 'Book Appointment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>



      <Footer />
    </>
  );
};

export default DoctorDetails;
