/**
 *
 * Asynchronously loads the component for AdminGrpPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
