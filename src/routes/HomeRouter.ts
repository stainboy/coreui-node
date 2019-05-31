import { Router } from 'express';
import { HomeComponent } from '../components';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.get('/', HomeComponent.show);

/**
 * @export {express.Router}
 */
export default router;
