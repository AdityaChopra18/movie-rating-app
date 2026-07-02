import { useRef, useState, useEffect } from 'react';

const Carousel = ({ children }) => {
  const rowRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftBtn(scrollLeft > 0);
      setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [children]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.carouselContainer}>
      {showLeftBtn && (
        <button style={{ ...styles.scrollBtn, left: '-15px' }} onClick={() => scroll('left')}>
          &#10094;
        </button>
      )}
      
      <div 
        style={styles.scrollRow} 
        ref={rowRef} 
        onScroll={handleScroll}
        className="hide-scrollbar"
      >
        {children}
      </div>

      {showRightBtn && (
        <button style={{ ...styles.scrollBtn, right: '-15px' }} onClick={() => scroll('right')}>
          &#10095;
        </button>
      )}
    </div>
  );
};

const styles = {
  carouselContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  scrollRow: {
    display: 'flex',
    gap: '1rem',
    overflowX: 'auto',
    paddingBottom: '1rem',
    scrollBehavior: 'smooth',
    flex: 1,
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none' // IE/Edge
  },
  scrollBtn: {
    position: 'absolute',
    top: 'calc(50% - 1.5rem)',
    zIndex: 10,
    backgroundColor: '#ff2d2d',
    color: '#fff',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    transition: 'transform 0.1s ease',
  }
};

export default Carousel;
