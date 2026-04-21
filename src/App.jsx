import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Heart, Music, Volume2, VolumeX, MapPin, Calendar, Search, Send,Users,CalendarDays ,Utensils,MessageSquareHeart, X } from 'lucide-react';

// ==================== IMAGE IMPORTS ====================
import couple from './assets/couple.jpeg';
import couple1 from './assets/couple1.jpeg';
import couple2 from './assets/couple2.jpeg';
import couple3 from './assets/couple3.jpeg';
import couple4 from './assets/couple4.jpeg';
import family from './assets/family.jpeg';
import family1 from './assets/family1.jpeg';
import wedding from './assets/wedding.jpeg';
import img from './assets/img.jpeg';
import temple from './assets/temple.jpg';
import resciption from './assets/resciption.jpg';

// ==================== AUDIO IMPORT ====================
import weddingMusic from '../public/music/Dheema.mp3';

export default function App() {
  const [activeSection, setActiveSection] = useState('HOME');
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [formData, setFormData] = useState({
    guestName: '',
    guestCount: '1 Guest',
    events: ['WEDDING CEREMONY', 'RECEPTION'],
    dietary: '',
    message: ''
  });
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [visibleItems, setVisibleItems] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryView, setGalleryView] = useState('grid');
  const audioRef = useRef(null);

  useEffect(() => {
    const calculateCountdown = () => {
      const targetDate = new Date('2026-05-18').getTime();
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setCountdown({
          days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
          hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
          minutes: String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0'),
          seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, '0')
        });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          el.classList.add('animated');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEventToggle = (event) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const handleRSVPSubmit = (e) => {
    e.preventDefault();
    if (!formData.guestName.trim()) {
      alert('Please enter your name.');
      return;
    }
    alert(`Thank you ${formData.guestName}! Your RSVP has been received. We will confirm shortly.`);
    setFormData({
      guestName: '',
      guestCount: '1 Guest',
      events: ['WEDDING CEREMONY', 'RECEPTION'],
      dietary: '',
      message: ''
    });
  };

  // ==================== MUSIC PLAYER HANDLER ====================
  const handleMusicToggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioLoaded(true);
          })
          .catch(err => {
            console.error('Audio play error:', err);
            alert('Unable to play music. Please check audio file path.');
          });
      }
    }
  };

  const handleAudioCanPlay = () => {
    setAudioLoaded(true);
  };

  const handleAudioError = (e) => {
    console.error('Audio error:', e);
    alert('Error loading audio file. Check the file path in the audio source.');
  };

  // ==================== GALLERY ARRAY ====================
  const gallery = [
    { id: 1, category: 'pre-wedding', image: wedding },
    { id: 2, category: 'couple', image: couple3 },
    { id: 3, category: 'couple', image: couple2 },
    { id: 4, category: 'family', image: family },
    { id: 5, category: 'couple', image: couple1 },
    { id: 6, category: 'family', image: family1 },
    { id: 7, category: 'pre-wedding', image: img },
    { id: 8, category: 'couple', image: couple4 }
  ];

  const filteredGallery = galleryFilter === 'all' ? gallery : gallery.filter(item => item.category === galleryFilter);

  const handleGalleryImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handlePreviousImage = () => {
    const currentIndex = filteredGallery.findIndex(item => item.image === selectedImage);
    if (currentIndex > 0) {
      setSelectedImage(filteredGallery[currentIndex - 1].image);
    } else {
      setSelectedImage(filteredGallery[filteredGallery.length - 1].image);
    }
  };

  const handleNextImage = () => {
    const currentIndex = filteredGallery.findIndex(item => item.image === selectedImage);
    if (currentIndex < filteredGallery.length - 1) {
      setSelectedImage(filteredGallery[currentIndex + 1].image);
    } else {
      setSelectedImage(filteredGallery[0].image);
    }
  };

  return (
    <div className="wedding-website">
      {/* ==================== AUDIO ELEMENT ==================== */}
      <audio
        ref={audioRef}
        loop
        onCanPlay={handleAudioCanPlay}
        onError={handleAudioError}
      >
        <source src={weddingMusic} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* ==================== FLOATING MUSIC PLAYER BUTTON ==================== */}
      <button 
        className={`floating-music-btn ${isPlaying ? 'playing' : 'paused'}`}
        onClick={handleMusicToggle}
        title={isPlaying ? 'Mute Music' : 'Play Music'}
        disabled={!audioLoaded}
      >
        <span className="speaker-icon">
          {isPlaying ? <Volume2 size={28} /> : <VolumeX size={28} />}
        </span>
        {isPlaying && <span className="music-wave"></span>}
        {isPlaying && <span className="music-wave wave-2"></span>}
      </button>

      {/* ==================== GALLERY MODAL ==================== */}
      {selectedImage && (
        <div className="gallery-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              <X size={32} />
            </button>
            <button className="modal-nav modal-prev" onClick={handlePreviousImage}>
              &#10094;
            </button>
            <img src={selectedImage} alt="Gallery" className="modal-image" />
            <button className="modal-nav modal-next" onClick={handleNextImage}>
              &#10095;
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <Heart size={32} className="heart-icon" />
            <span className="logo-text">S&I</span>
          </div>
          <ul className="nav-links">
            {['HOME', 'WELCOME', 'EVENTS', 'GALLERY', 'RSVP'].map(item => (
              <li key={item}>
                <a
                  href="#"
                  className={`nav-link ${activeSection === item ? 'active' : ''}`}
                  onClick={() => handleNavClick(item)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* HOME Section */}
      <section id="HOME" className="section home-section">
        <div className="animated-bg"></div>
        <div className="floating-elements">
          <div className="float-item float-1">🌸</div>
          <div className="float-item float-2">✨</div>
          <div className="float-item float-3">🌹</div>
          <div className="float-item float-4">💖</div>
          <div className="float-item float-5">💖</div>
          <div className="float-item float-6">🎊</div>
          <div className="float-item float-7">💞</div>
          <div className="float-item float-8">💘</div>
        </div>
        <div className="hero-content">
          <h1 className="main-title">
            <span>R.Sudhakar</span>
            <span>&</span>
            <span>V.Iswarya</span>
          </h1>
          <div className="title-divider">
            <span></span>
            <span className="dot"></span>
            <span></span>
          </div>
          <p className="date-text">May 2026 <span>CELEBRATE</span></p>
          <p className="location-text">ERAL · TAMIL NADU · THOOTHUKUDI</p>

          <div className="countdown-section">
            <p className="countdown-label">COUNTING DOWN TO FOREVER</p>
            <div className="countdown">
              <div className="countdown-item" data-animate>
                <div className="countdown-number">{countdown.days}</div>
                <div className="countdown-unit">DAYS</div>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-item" data-animate>
                <div className="countdown-number">{countdown.hours}</div>
                <div className="countdown-unit">HOURS</div>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-item" data-animate>
                <div className="countdown-number">{countdown.minutes}</div>
                <div className="countdown-unit">MINUTES</div>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-item" data-animate>
                <div className="countdown-number">{countdown.seconds}</div>
                <div className="countdown-unit">SECONDS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WELCOME Section */}
      <section id="WELCOME" className="section welcome-section">
        <div className="section-content">
          <p className="bible-verse" data-animate>"This is the day the Lord has made"</p>
          <h2 className="section-title" data-animate>Wedding Celebrations</h2>
          <p className="section-subtitle" data-animate>Join us in these sacred moments</p>

          <div className="couple-cards">
            <div className="couple-card" data-animate>
              <div className="card-glow groom-glow"></div>
              <h3 className="card-title groom">The Groom</h3>
              <p className="couple-name">R. Sudhakar B.Sc,M.PEd</p>
              <p className="couple-parents">S/o Mr. N. Raman & Mrs. R. Vijaya</p>
              <p className="couple-location">Undiyaloor, Perungulam, Eral</p>
            </div>
            <div className="couple-card" data-animate>
              <div className="card-glow bride-glow"></div>
              <h3 className="card-title bride">The Bride</h3>
              <p className="couple-name">V. Iswarya M.COM</p>
              <p className="couple-parents">D/o Mr. V. Velusamy & Mrs. V. Selva Kani</p>
              <p className="couple-location">Sonaganvillai, Thiruchendur</p>
            </div>
          </div>

          <div className="event-cards-container">
            <div className="event-card main-event" data-animate>
              <div className="event-glow"></div>
              <div className="event-badge">★ MAIN EVENT</div>
              <h3 className="event-name">Mangala Vivaham</h3>
              <p className="event-type">Wedding Ceremony</p>
              <p className="event-date">MONDAY, MAY 18, 2026</p>
              <p className="event-time">9:30 AM - 10:30 AM</p>
              <p className="event-venue">J.J Mahal</p>
              <p className="event-location">Eral, Thoothukudi</p>
              <div className="event-buttons">
                <button className="btn btn-primary" onClick={() => window.open('https://www.google.com/maps/search/J2FC%2BMMF,+Eral,+Tamil+Nadu+628801', '_blank')}>
                  <MapPin size={18} /> VIEW ON MAP
                </button>
              </div>
            </div>

            <div className="event-card" data-animate>
              <div className="event-glow"></div>
              <div className="event-badge celebration">★ CELEBRATION</div>
              <h3 className="event-name">Wedding Reception</h3>
              <p className="event-type">Evening Celebration</p>
              <p className="event-date">MONDAY, MAY 18, 2026</p>
              <p className="event-time">7:00 PM ONWARDS</p>
              <p className="event-venue">Groom Home</p>
              <p className="event-location">Undiyaloor, Perungulam</p>
              <div className="event-buttons">
                <button className="btn btn-primary" onClick={() => window.open('https://www.google.com/maps/search/Undiyaloor,+Perungulam,+Tamil+Nadu', '_blank')}>
                  <MapPin size={18} /> VIEW ON MAP
                </button>
              </div>
            </div>
          </div>

          <div className="blessings" data-animate>
            <p><span className="blessing-label">Best Compliments from</span></p>
            <p className="blessing-names">N.Meenachi Sundharam., R. Surya B.E., R. Sathish DME,BA.Tamil., R. Krishna Veni B.E.</p>
            <p><span className="blessing-label">With Love from</span></p>
            <p className="blessing-names">D. Elavarasi B.Sc & D. Petchiammal</p>
            <p className="blessing-names">D. Easaki Rani & S. Sankar & S. Harish</p>
            <p className="blessing-quote">"And now these three remain: faith, hope and love. But the greatest of these is love."</p>
          </div>
        </div>
      </section>

      {/* EVENTS Section */}
      <section id="EVENTS" className="section events-section">
        <div className="animated-bg-events"></div>
        <div className="section-content">
          <h2 className="section-title" style={{color: '#fff'}} data-animate>Wedding Events</h2>
          <p className="section-subtitle" style={{color: '#FFD700'}} data-animate>Detailed information about our celebration</p>

          <div className="events-detail">
            <div className="event-detail-card" data-animate>
              <div className="event-icon">
                <img src={temple} alt="temple icon"
                  width="80"
                  height="80"
                  />
              </div>
              <h3>Mangala Vivaham</h3>
              <p><strong>Date:</strong> Monday, MAY 18, 2026</p>
              <p><strong>Time:</strong> 9:30 AM - 10:30 AM</p>
              <p><strong>Venue:</strong> J.J Mahal, Eral, Thoothukudi</p>
              <p className="event-detail-description">Join us for the sacred ceremony where two souls become one in Christ.</p>
            </div>

            <div className="event-detail-card" data-animate>
              <div className="event-icon">
                <img src={resciption} alt="temple icon"
                  width="80"
                  height="80"
                  />
              </div>
              <h3>Wedding Reception</h3>
              <p><strong>Date:</strong> Monday, MAY 18, 2026</p>
              <p><strong>Time:</strong> 7:00 PM Onwards</p>
              <p><strong>Venue:</strong> Undiyaloor, Perungulam</p>
              <p className="event-detail-description">Celebrate with us as we share dinner, dancing, and joyous moments with family and friends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY Section */}
      <section id="GALLERY" className="section gallery-section">
        <div className="section-content">
          <h2 className="section-title" data-animate>Our Memories</h2>
          <p className="section-subtitle" data-animate>Beautiful moments captured</p>

          <div className="gallery-controls">
            <div className="gallery-filters">
              <button
                className={`filter-btn ${galleryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setGalleryFilter('all')}
              >
                All Photos
              </button>
              <button
                className={`filter-btn ${galleryFilter === 'couple' ? 'active' : ''}`}
                onClick={() => setGalleryFilter('couple')}
              >
                Couple
              </button>
              <button
                className={`filter-btn ${galleryFilter === 'pre-wedding' ? 'active' : ''}`}
                onClick={() => setGalleryFilter('pre-wedding')}
              >
                Pre-Wedding
              </button>
              <button
                className={`filter-btn ${galleryFilter === 'family' ? 'active' : ''}`}
                onClick={() => setGalleryFilter('family')}
              >
                Family
              </button>
            </div>

            {/* <div className="gallery-view-toggle">
              <button
                className={`view-btn ${galleryView === 'grid' ? 'active' : ''}`}
                onClick={() => setGalleryView('grid')}
                title="Grid View"
              >
                ⊞ Grid
              </button>
              <button
                className={`view-btn ${galleryView === 'list' ? 'active' : ''}`}
                onClick={() => setGalleryView('list')}
                title="List View"
              >
                ≡ List
              </button>
            </div> */}
          </div>

          <div className={`gallery-grid ${galleryView === 'list' ? 'list-view' : ''}`}>
            {filteredGallery.map((item, idx) => (
              <div key={item.id} className="gallery-item" data-animate style={{animationDelay: `${idx * 0.1}s`}}>
                <img src={item.image} alt={`Gallery ${item.id}`} onClick={() => handleGalleryImageClick(item.image)} />
                <div className="gallery-overlay">
                  <button className="zoom-btn" onClick={() => handleGalleryImageClick(item.image)}>
                    <Search size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="RSVP" className="section rsvp-section">
        <div className="animated-bg-rsvp"></div>
        <div className="section-content">
          <p className="bible-verse" data-animate>"For I know the plans I have for you"</p>
          <h2 className="section-title" data-animate>Join Our Celebration</h2>
          <p className="section-subtitle" data-animate>We would be honored by your presence</p>

          <div className="rsvp-container">
            
            <div className="rsvp-info">
              
              <div className="save-the-date" data-animate>
            
                <div 
                  className="save-the-date-bg" 
                  style={{backgroundImage: `url(${couple})`}}
                >
                </div>
                
                <div className="save-the-date-overlay"></div>
                <div className="save-the-date-content">
                  <h5 className="date-title">சுதாகர் & ஐஸ்வர்யா</h5>
                  <h2 className="save-date">MAY 18, 2026</h2>
                  <p className="save-venue">J.J Mahal, Eral ,Thoothukudi</p>
                </div>
              </div>

              <div className="contact-info" data-animate>
                <h4>For Enquiries Contact</h4>
                <p className="contact-number">7094528454, 9750559738</p>
              </div>
            </div>

            <form className="rsvp-form" onSubmit={handleRSVPSubmit} data-animate>
              <div className="form-group">
                <label htmlFor="name">
                  <Users size={18} style={{color:'yellow'}} /> YOUR NAME <span className="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.guestName}
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="guests"><Users  size={18} style={{color:'yellow'}} /> NUMBER OF GUESTS</label>
                <select
                  id="guests"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                >
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                  <option>5+ Guests</option>
                </select>
              </div>

              <div className="form-group">
                <label><CalendarDays  size={18} style={{color:'yellow'}} /> EVENTS ATTENDING</label>
                <div className="checkbox-group">
                  {[' WEDDING CEREMONY', ' RECEPTION'].map(event => (
                    <label key={event} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.events.includes(event)}
                        onChange={() => handleEventToggle(event)}
                      />
                      {event}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dietary"><Utensils  size={18} style={{color:'yellow'}}/> DIETARY PREFERENCES</label>
                <textarea
                  id="dietary"
                  placeholder="Any dietary restrictions or allergies?"
                  value={formData.dietary}
                  onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message"><MessageSquareHeart size={18} style={{color:'yellow'}} /> MESSAGE FOR THE COUPLE</label>
                <textarea
                  id="message"
                  placeholder="Share your wishes..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows="3"
                />
              </div>

              <button type="submit" className="btn btn-submit">
                <Send size={18} /> SEND RSVP
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-content">
          <div className="footer-couple-image" data-animate>
            <img src={couple} alt="Couple" />
          </div>

          <p className="bible-verse-footer" data-animate>
            "What God has joined together, let no one separate"
          </p>
          
          <p className="bible-verse-footer quote" data-animate>
            "Love is patient, love is kind. It does not envy, it does not boast, it is not proud."
          </p>
          
          <div className="divider"></div>
          
          <h2 className="footer-title">THE WEDDING OF</h2>
          
          <h1 className="footer-couple-name">
            <span className="groom-name">R. Sudhakar</span>
            <span className="ampersand">&</span>
            <span className="bride-name">V. Iswarya</span>
          </h1>
          
          <p className="footer-date">Monday, May 18, 2026</p>
          <p className="footer-venue">J.J Mahal, Eral ,Thoothukudi</p>
          <p className="footer-blessing">With Love and Blessings</p>
          <p className="footer-blessing1">© 2026 Surya R. Built with code & creativity.</p>
        </div>
      </footer>
    </div>
  );
}