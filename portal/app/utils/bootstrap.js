import purple from 'material-ui-next/colors/purple';

export const BOOTSTRAP_CLASSES = {
  filter: 'form-control',
  select: 'form-control',
  button: 'btn btn btn-block btn-default',
  buttonActive: 'btn btn btn-block btn-primary',
};

export const styles = theme => ({
  button: {
    // margin: theme.spacing.unit,
    marginTop: 10,
    marginLeft: 10,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  root: {
    flexGrow: 1,
    marginTop: 10,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  inputLabelFocused: {
    color: purple[500],
  },
  inputInkbar: {
    '&:after': {
      backgroundColor: purple[500],
    },
  },
  textFieldRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  textFieldInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  textFieldFormLabel: {
    fontSize: 18,
  },
  'list-sort-demo-wrapper': {
    position: 'relative',
    background: '#e6e6e6',
    overflow: 'hidden',
    // height: '200px',
    // margin: '3em',
    padding: '0.5em',
    verticalAlign: 'center',
  },
  'list-sort-demo': {
    margin: '40px auto',
    maxWidth: '350px',
    width: '90%',
    position: 'relative',
    height: '305px',
  },
  'list-sort-demo > div': {
    overflow: 'hidden',
  },
  'list-sort-demo-list': {
    background: '#fff',
    borderRadius: '2px',
    margin: '5px auto',
    padding: '10px',
    height: '35px',
    transition: 'box-shadow .5s, transform .5s',
    // verticalAlign: 'center',
    // textAlign: 'center',
    display: 'flex',
    alignSelf: 'flex',
    width: '100%',
  },
  'list-sort-demo-list.list-drag-selected': {
    boxShadow: '0 8px 20px #E6E6E6',
    transform: 'scale(1.1) !important',
  },
  'list-sort-demo-icon': {
    width: '20%',
    display: 'inline-block',
    textAlign: 'center',
    fontSize: '14px',
    // lineHeight: '20px',
    verticalAlign: 'center',
  },
  'list-sort-demo-text': {
    width: '80%',
    display: 'inline-block',
    fontSize: '12px',
  },
});
