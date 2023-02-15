const burger = document.getElementById('show_menu') //checkbox to hide or show the menu
const link = document.querySelector('.link_list') // Menu
const burgerLabel = document.querySelector('.burger') // Burger image to click on

let isActive = true // show the menu if true

 // hide the menu by default in small screens
if (window.innerWidth < 875) {
  isActive = false
  link.style.transform = isActive ? 'translateY(0px)' : 'translateY(-400px)'
}

// prevent display errors in case of window resize for desktop view
window.addEventListener('resize', ()=>{
  // hide the menu if size lesser than 875px
  if (window.innerWidth < 875) {
    isActive = false
    // else show the menu, and reset the input to false
  } else {
    isActive = true
    burger.checked = false
  }
  link.style.transform = isActive ?  'translateY(0px)' : 'translateY(-400px)'
})
// on click watch for the burger input status
// show or hide the menu depending on the status
// add the rotate class name to the burger to animate it
burger.addEventListener('click', ()=> {
  isActive = burger.checked
  link.style.transform = isActive ? 'translateY(0px)' : 'translateY(-400px)'
  burgerLabel.classList.toggle('rotate')
})
