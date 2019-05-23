/**
 *
 * Asynchronously loads the component for ExpenseGrpPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
