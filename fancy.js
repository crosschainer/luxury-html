// Get all the navigation links
const navLinks = document.querySelectorAll('.section-link');

// Get all the content sections
const sections = document.querySelectorAll('.content');

// get burger menu
const burgerMenu = document.querySelector(".burger-menu");
const mobileNav = document.querySelector("nav.flex-grow-1");

// get header
const header = document.querySelector("header");
const main = document.querySelector("main");

// on dom content loaded
document.addEventListener("DOMContentLoaded", function () {
  // load anim css
  let animCSS = document.createElement("link");
  animCSS.rel = "stylesheet";
  animCSS.href = "anim.css";
  document.head.appendChild(animCSS);
});

// Use GSAP for section switching with fading animations
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
        navLinks.forEach((link) => {
            link.classList.remove("active-nav");
        });
      // Add the active-nav class to the id of the link
      
      let menu_id = event.target.id.replace("#", "");
      main.style.display = "flex";
      if(menu_id != "nav-0" && menu_id != "") {
        document.getElementById(menu_id).classList.add("active-nav");
        
      }
      
      if(menu_id == "") {
        // find menu id in navLinks by href
        // targetId == href
        menu_id = document.querySelector(`[href="${targetId}"]`).id;
        document.getElementById(menu_id).classList.add("active-nav");
      }
      burgerMenu.classList.remove("active");
      
      // Use GSAP to create a fading animation
      gsap.to(sections, {
        opacity: 0, // Fade out all sections
        duration: 0.25,
        onStart: () => {
          sections.forEach((section) => {
            section.style.display = "none"; // Hide all sections
            
        });
        },
        onComplete: () => {
          

          if(targetSection.id == "home") {
            main.classList.add("mt-5");
            main.classList.remove("align-items-flex-start")
          }
          else {
            main.classList.remove("mt-5");
            main.classList.add("align-items-flex-start")
          }
          // Show the target section and fade it in
          targetSection.style.display = "block";
          targetSection.style.zIndex = 1;
          gsap.to(targetSection, {
            opacity: 1,
            duration: 0.15,
          });
        },
      });
      
      // fade out mobile nav if opacity is 1
        if (mobileNav.classList.contains("active")) {
            gsap.to(mobileNav, {
                opacity: 0,
                duration: 0.15,
                onStart: () => {
                  mobileNav.style.display = "none";
                 
                },
                onComplete: () => {
                    mobileNav.classList.remove("active");
                    
                },
            });
        }


    });
});



burgerMenu.addEventListener("click", function () {
    burgerMenu.classList.toggle("active");

  if (mobileNav.classList.contains("active")) {
    main.style.display = "flex";
    gsap.to(mobileNav, {
      opacity: 0,
      duration: 0.15,
      onStart: () => {
        mobileNav.style.display = "none"; // Display the mobileNav before fading in
      },
      onComplete: () => {
          mobileNav.classList.remove("active");
          
          
      },
    });
  } else {
    main.style.display = "none";
  
    gsap.to(mobileNav, {
      opacity: 1,
      duration: 0.15,
      onStart: () => {
        mobileNav.style.display = "flex"; // Display the mobileNav before fading in
      },
      onComplete: () => {
          mobileNav.classList.add("active");

          
      },
    });
  }
});
