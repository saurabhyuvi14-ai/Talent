import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createIcons, Menu, X, ShieldCheck, Award, GraduationCap, CheckCircle, Target, Users, FileText, Brain, Phone, MapPin, Mail, Sun, Sunset, CalendarDays, MessageCircle, BookOpen, ClipboardCheck, HelpCircle, UserPlus, RefreshCw, Shield, Share2 } from 'lucide';

gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Icons
function initIcons() {
  createIcons({
    icons: {
      Menu, X, ShieldCheck, Award, GraduationCap, CheckCircle, Target, Users, FileText, Brain, Phone, MapPin, Mail, Sun, Sunset, CalendarDays, MessageCircle, BookOpen, ClipboardCheck, HelpCircle, UserPlus, RefreshCw, Shield, Share2
    }
  });
}

// 2. Three.js Hero Background
function initThreeHero() {
  const canvas = document.querySelector('#three-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const particlesCount = 2000;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

    // Randomize colors between red, blue and white
    const r = Math.random();
    if (r < 0.33) {
      colors[i * 3] = 0.77; colors[i * 3 + 1] = 0.18; colors[i * 3 + 2] = 0.18; // Red
    } else if (r < 0.66) {
      colors[i * 3] = 0.17; colors[i * 3 + 1] = 0.21; colors[i * 3 + 2] = 0.28; // Blue
    } else {
      colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1; // White
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.6
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  camera.position.z = 5;

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.001;
    points.rotation.x += 0.0005;

    gsap.to(camera.position, {
        x: mouseX * 2,
        y: -mouseY * 2,
        duration: 2,
        ease: "power2.out"
    });

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// 3. Three.js About Section Mesh (Floating Cube/Book)
function initThreeMesh() {
    const container = document.querySelector('#three-cube-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(2, 2.5, 0.5);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xc53030, // Primary red
        shininess: 100,
        flatShading: false
    });
    
    const book = new THREE.Mesh(geometry, material);
    scene.add(book);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        book.rotation.y += 0.01;
        book.rotation.z += 0.005;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// 4. GSAP Counter Animation
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: "power2.out"
        });
      }
    });
  });
}

// 5. Scroll Animations (Simple Intersection Observer)
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));

  // Hero Parallax Effect
  gsap.to('.hero-content-bottom-left', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: 80,
    opacity: 0.8
  });
}

// 6. Header Scroll & Mobile Menu
function initHeader() {
  const nav = document.querySelector('#main-nav');
  const toggle = document.querySelector('#mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  if (toggle && navLinks) {
    const toggleMenu = () => {
      navLinks.classList.toggle('active');
      body.classList.toggle('menu-open');
      const icon = toggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      initIcons(); 
    };

    toggle.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }
}

// 7. Form Submission Placeholder
function initForm() {
  const form = document.querySelector('#inquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your inquiry! We will contact you shortly.');
      form.reset();
    });
  }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initThreeHero();
  initThreeMesh();
  initCounters();
  initScrollAnimations();
  initHeader();
  initForm();
});
