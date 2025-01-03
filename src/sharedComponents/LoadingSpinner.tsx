interface LoadingSpinnerProps {
    width?: number,
    height?: number
    path?: string
}

const LoadingSpinner = ({width, height, path}: LoadingSpinnerProps) => {
    return (
        <img src={"/loading.gif"} width={width??450} height={height??450} alt="Loading..." />
    )
}

export default LoadingSpinner