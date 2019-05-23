/**
 *
 * Asynchronously loads the component for DashboardIioT
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
