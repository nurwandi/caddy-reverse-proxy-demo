import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(999999)
  const [isLoading, setIsLoading] = useState(true)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [bgColor, setBgColor] = useState('#ff00ff')
  const [text, setText] = useState('LOADING...')
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const buttonRef = useRef(null)

  // Unlock audio on first user interaction (mobile fix)
  useEffect(() => {
    const unlockAudio = () => {
      if (!audioUnlocked) {
        // Play silent audio to unlock audio context
        const silentAudio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABhADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/////////////////////////////////////////////////////////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQCgAAAAAAAAAGEfxVxRwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==')
        silentAudio.play().then(() => {
          setAudioUnlocked(true)
          console.log('Audio unlocked!')
        }).catch(() => {})
      }
    }

    // Listen for first interaction
    document.addEventListener('touchstart', unlockAudio, { once: true })
    document.addEventListener('click', unlockAudio, { once: true })

    return () => {
      document.removeEventListener('touchstart', unlockAudio)
      document.removeEventListener('click', unlockAudio)
    }
  }, [audioUnlocked])

  // Array of random meme sounds to play on load
  const memeSoundsOnLoad = [
    'https://www.myinstants.com/media/sounds/curb-your-enthusiasm-theme.mp3',
    'https://www.myinstants.com/media/sounds/dramatic-violin.mp3',
    'https://www.myinstants.com/media/sounds/surprise-mothafucka.mp3',
    'https://www.myinstants.com/media/sounds/bruh-sound-effect-2.mp3',
    'https://www.myinstants.com/media/sounds/windows-xp-error.mp3',
    'https://www.myinstants.com/media/sounds/fbi-open-up.mp3'
  ]

  // Play "AH" sound on scroll (desktop + mobile)
  useEffect(() => {
    let lastPlay = 0
    const handleScroll = () => {
      const now = Date.now()
      if (now - lastPlay > 200) { // Play every 200ms of scrolling to avoid crashing the browser
        const audio = new Audio('https://www.myinstants.com/media/sounds/auughhh.mp3')
        audio.volume = 0.4
        audio.play().catch(() => {}) // Silently fail if audio blocked
        lastPlay = now
      }
    }

    // Listen to both window and document scroll for mobile compatibility
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true })

    // Add touchmove for mobile scroll detection
    let touchStartY = 0
    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY
      if (Math.abs(touchY - touchStartY) > 10) { // Threshold for scroll
        handleScroll()
        touchStartY = touchY
      }
    }
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  // Play a random meme sound when the loading screen first appears
  useEffect(() => {
    if (isLoading) {
      const randomMemeSound = memeSoundsOnLoad[Math.floor(Math.random() * memeSoundsOnLoad.length)]
      const audio = new Audio(randomMemeSound)
      audio.volume = 0.6 // Slightly lower volume than the scream button
      audio.play().catch(e => console.error("Meme audio play failed (expected):", e))
    }
  }, [isLoading]) // Only run when isLoading changes

  // Fake endless loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setText('WELCOME TO THE FUTURE OF INTERNET')
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  // Annoying background strobe
  useEffect(() => {
    const interval = setInterval(() => {
      setBgColor(prev => prev === '#ff00ff' ? '#00ff00' : '#ff00ff')
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Mobile chaos: Random sounds + color flash on ANY touch
  useEffect(() => {
    const chaosColors = ['#ff00ff', '#00ff00', '#ff0000', '#0000ff', '#ffff00', '#00ffff', '#ff00aa', '#aaff00']
    const chaosSounds = [
      // Classic annoying
      'https://www.myinstants.com/media/sounds/air-horn-club-sample_1.mp3',
      'https://www.myinstants.com/media/sounds/fart-with-reverb.mp3',
      'https://www.myinstants.com/media/sounds/error.mp3',
      'https://www.myinstants.com/media/sounds/bonk.mp3',
      'https://www.myinstants.com/media/sounds/vine-boom.mp3',
      'https://www.myinstants.com/media/sounds/metal-pipe-clang.mp3',
      'https://www.myinstants.com/media/sounds/bruh-sound-effect-2.mp3',
      // Extra annoying sounds
      'https://www.myinstants.com/media/sounds/nani.mp3',
      'https://www.myinstants.com/media/sounds/windows-xp-error.mp3',
      'https://www.myinstants.com/media/sounds/nokia-arabic-ringtone.mp3',
      'https://www.myinstants.com/media/sounds/sad-trombone.mp3',
      'https://www.myinstants.com/media/sounds/crickets-chirping.mp3',
      'https://www.myinstants.com/media/sounds/wrong-answer-buzzer.mp3',
      'https://www.myinstants.com/media/sounds/why-are-you-running.mp3',
      'https://www.myinstants.com/media/sounds/oh-no-no-no-no.mp3',
      'https://www.myinstants.com/media/sounds/loud-correct-sound-effect.mp3',
      'https://www.myinstants.com/media/sounds/scream_1.mp3',
      'https://www.myinstants.com/media/sounds/screaming-goat.mp3',
      'https://www.myinstants.com/media/sounds/clown-horn.mp3',
      'https://www.myinstants.com/media/sounds/yeet.mp3',
      'https://www.myinstants.com/media/sounds/oof-roblox.mp3',
      'https://www.myinstants.com/media/sounds/discord-notification.mp3',
      'https://www.myinstants.com/media/sounds/quack.mp3',
      'https://www.myinstants.com/media/sounds/boing.mp3',
      'https://www.myinstants.com/media/sounds/wow.mp3'
    ]

    let lastTouch = 0
    const handleMobileChaos = (e) => {
      const now = Date.now()
      // Throttle to avoid complete insanity
      if (now - lastTouch > 150) {
        // Random color flash
        const randomColor = chaosColors[Math.floor(Math.random() * chaosColors.length)]
        setBgColor(randomColor)

        // Random sound
        const randomSound = chaosSounds[Math.floor(Math.random() * chaosSounds.length)]
        const audio = new Audio(randomSound)
        audio.volume = 0.3 // Lower volume to avoid ear destruction
        audio.play().catch(() => {})

        lastTouch = now
      }
    }

    // Only activate on mobile (touch device)
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', handleMobileChaos, { passive: true })
      return () => document.removeEventListener('touchstart', handleMobileChaos)
    }
  }, [])

  // Annoying sounds list
  const annoyingSounds = [
    'https://www.myinstants.com/media/sounds/air-horn-club-sample_1.mp3',
    'https://www.myinstants.com/media/sounds/fart-with-reverb.mp3',
    'https://www.myinstants.com/media/sounds/error.mp3',
    'https://www.myinstants.com/media/sounds/bonk.mp3',
    'https://www.myinstants.com/media/sounds/vine-boom.mp3',
    'https://www.myinstants.com/media/sounds/metal-pipe-clang.mp3'
  ]

  // Button runs away and makes noise
  const handleHover = () => {
    if (buttonRef.current) {
      // Move button
      const x = Math.random() * (window.innerWidth - 100)
      const y = Math.random() * (window.innerHeight - 50)
      setPosition({ x, y })

      // Play random sound
      const randomSound = annoyingSounds[Math.floor(Math.random() * annoyingSounds.length)]
      const audio = new Audio(randomSound)
      audio.volume = 0.5
      audio.play().catch(e => console.error("Audio play failed (good):", e))
    }
  }

  // Counter goes down
  const handleClick = () => {
    setCount(prev => prev - Math.floor(Math.random() * 1000))
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h1 className="blink">DOWNLOADING MORE RAM... {Math.random().toFixed(2)}%</h1>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="bad-container" style={{ backgroundColor: bgColor }}>
      {/* Mobile tap prompt - annoying spinning text */}
      <div className="mobile-tap-prompt">
        PLEASE TAP ANYWHERE
      </div>

      <marquee scrollamount="20" direction="right" className="scroller">
        WARNING: THIS WEBSITE IS NOT OPTIMIZED FOR YOUR EYES!!! BUY MORE EYES!!!
      </marquee>
      
      <header className="broken-header">
        <h1>
          <span style={{ fontSize: '10px' }}>welcome to</span>
          <br/>
          <span style={{ fontFamily: 'Papyrus', fontSize: '80px', color: 'red' }}>G</span>
          <span style={{ fontFamily: 'Impact', fontSize: '12px', color: 'yellow' }}>R</span>
          <span style={{ fontFamily: 'Comic Sans MS', fontSize: '100px', color: 'blue' }}>A</span>
          <span style={{ fontFamily: 'Courier', fontSize: '40px', color: 'purple' }}>P</span>
          <span style={{ fontFamily: 'Arial', fontSize: '10px', color: 'orange' }}>H</span>
          <span style={{ fontFamily: 'Times New Roman', fontSize: '90px', color: 'green' }}>I</span>
          <span style={{ fontFamily: 'Wingdings', fontSize: '60px', color: 'white' }}>C</span>
          <span style={{ fontFamily: 'Tahoma', fontSize: '20px', color: 'black' }}>S</span>
        </h1>
      </header>

      <main>
        <div className="ad-banner">
          <p>CONGRATULATIONS! YOU ARE THE 1,000,000th VISITOR!</p>
          <button onClick={() => {
            const audio = new Audio('https://www.myinstants.com/media/sounds/scream_1.mp3');
            audio.volume = 1.0; // MAX VOLUME
            audio.play().catch(e => console.error("AUDIO ERROR:", e));
          }}>CLAIM PRIZE (INSTANT DEATH)</button>
        </div>

        <div className="content-mess">
          <p className="tiny-text">
            lorem ipsum dolor sit amet but worse because i cant read it
          </p>
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXNtaW14bHZ3bnZ6bXNtaW14bHZ3bnZ6bXNtaW14bHZ3bnZ6bXNtaW14bHZ3bnZ6bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JIX9t2j0ZTN9S/giphy.gif" 
            alt="cat" 
            className="stretched-img"
          />
          <div className="overlay-text">
            TEXT ON TOP OF IMAGE THAT YOU CANNOT READ
          </div>
        </div>

        <button 
          ref={buttonRef}
          style={{ 
            position: 'fixed', 
            left: position.x, 
            top: position.y,
            transition: 'all 0.1s ease'
          }}
          onMouseEnter={handleHover}
          onClick={handleClick}
          className="impossible-btn"
        >
          CLICK ME FOR SATISFACTION
        </button>

        <div className="hit-counter">
          Visits left until website deleted: {count}
        </div>

        <form className="bad-form" onSubmit={(e) => e.preventDefault()}>
            <label>ENTER PASSWORD TO SCROLL:</label>
            <input type="checkbox" />
            <input type="text" placeholder="type here" disabled />
            <button type="submit">SUBMIT</button>
        </form>

      </main>

      <footer className="footer-stuck">
        <p>© 1998 - 2026 COPYRIGHT INFRINGEMENT INTENDED</p>
        <a href="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTh1YjYwMTY2Y3BzNml1NTZhdDIwb2ZqODNnODlvOXp4ZGVld2xvcCZlcD12MV9pbnRlcm5ubF9naWZfYnlfaWQmY3Q9Zw/fUYhyT9IjftxrxJXcE/giphy.gif" target="_blank" rel="noopener noreferrer">Click here to uninstall your browser</a>
      </footer>
    </div>
  )
}

export default App