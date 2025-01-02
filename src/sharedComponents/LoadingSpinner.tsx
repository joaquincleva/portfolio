interface LoadingSpinnerProps {
    width?: number,
    height?: number
}

const LoadingSpinner = ({width, height}: LoadingSpinnerProps) => {
    return (
        <img src="./loading.gif" width={width??450} height={height??450} alt="Loading..." />
    )
}

export default LoadingSpinner