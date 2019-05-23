/**
 *
 * Asynchronously loads the component for FunctionPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
