
const toggleSidebar = props => () => {
  console.log(props)
  if (props.isCollapsed) {
    props.expandSidebar();
  } else {
    props.collapseSidebar();
  }
};

export { toggleSidebar };