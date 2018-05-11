export function ErrorIndicator(props){
  if(props.enabled){
    return <span id="error-icon"></span>
  }
  return ""
}

export function LoadingIndicator(props){
  if(props.enabled){
    return <span id="loading-icon"></span>
  }
  return ""
}