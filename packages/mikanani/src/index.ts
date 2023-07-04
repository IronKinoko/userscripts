import { router } from 'shared'
import { home } from './home'

router([{ pathname: /^\/$/, run: home }])
