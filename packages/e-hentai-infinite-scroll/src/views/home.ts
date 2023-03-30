import { Cookie } from 'shared'

export function checkCookie() {
  const igneous = Cookie.get('igneous')
  const yay = Cookie.get('yay')

  if (!igneous && yay && document.body.innerHTML === '') {
    $('<button>refresh</button>').on('click', refresh).appendTo('body')
    $('<button>login</button>').on('click', login).appendTo('body')
  }
}

function refresh() {
  Cookie.remove({ name: 'yay', domain: '.exhentai.org' })
  Cookie.remove({ name: 'igneous', domain: '.exhentai.org' })
  Cookie.remove({ name: 'ipb_pass_hash', domain: '.exhentai.org' })
  Cookie.remove({ name: 'ipb_member_id', domain: '.exhentai.org' })
  window.location.reload()
}
function login() {
  window.location.href =
    'https://forums.e-hentai.org/index.php?act=Login&CODE=00'
}
