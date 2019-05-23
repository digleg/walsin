/**
 *
 * Asynchronously loads the component for AdminCppage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
