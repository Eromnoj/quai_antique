const burger = document.getElementById('show_menu')
const link = document.querySelector('.link_list')
const burgerLabel = document.querySelector('.burger')
let isActive = false

if (window.innerWidth < 875) {
  isActive = false
  link.style.transform = isActive ? 'translateY(0px)' : 'translateY(-400px)'

}

window.addEventListener('resize', ()=>{
  if (window.innerWidth < 875) {
    isActive = false
  } else {
    isActive = true
    burger.checked = false
  }
  link.style.transform = isActive ?  'translateY(0px)' : 'translateY(-400px)'
  burgerLabel.classList.toggle('rotate')

})

burger.addEventListener('click', ()=> {
  isActive = burger.checked
  link.style.transform = isActive ? 'translateY(0px)' : 'translateY(-400px)'
  burgerLabel.classList.toggle('rotate')
})
