import { keybind, router } from 'shared'

router([
  {
    path: /novel\/.*\/.*\.html/,
    run: () => {
      const href = $('.footer > a.f-right').attr('href')
      $('head').append(`<link rel="prefetch" href="${href}" />`)

      keybind(['a', 'd', 'ArrowLeft', 'ArrowRight'], (e, key) => {
        switch (key) {
          case 'a':
          case 'ArrowLeft':
            $('.footer > a.f-left')[0].click()
            break
          case 'd':
          case 'ArrowRight':
            $('.footer > a.f-right')[0].click()
            break
        }
      })
    },
  },
])
