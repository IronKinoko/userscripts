import { Cookie } from 'shared'

export function checkCookie() {
  const igneous = Cookie.get('igneous')

  if (!igneous || igneous === 'mystery') {
    $('<button>refresh</button>').on('click', refresh).appendTo('body')
    $('<button>login</button>').on('click', login).appendTo('body')
  }
  if (igneous === 'mystery') {
    $(
      '<h2>[Cookie] igneous error! Change system proxy and reload page</h2>'
    ).appendTo('body')
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
