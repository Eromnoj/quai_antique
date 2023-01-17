const burger = document.getElementById('show_menu')
const link = document.querySelector('.link_list')

let isActive = false

if (window.innerWidth > 875) {
  isActive = true
}

window.addEventListener('resize', ()=>{
  if (window.innerWidth > 875) {
    isActive = true
  } else {
    isActive = false
    burger.checked = false
  }
  link.style.display = isActive ? 'flex' : 'none'

})

burger.addEventListener('click', ()=> {
  isActive = burger.checked
  link.style.display = isActive ? 'flex' : 'none'
})
