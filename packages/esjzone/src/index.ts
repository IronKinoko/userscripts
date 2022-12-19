import { router } from 'shared'
import { main as read } from './read'

router([{ path: /forum\/\d+\/\d+\.html/, run: read }])
