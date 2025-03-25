import LoaderApp from 'react-ts-loaders'

export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderApp
        type="roller"
        color="rgb(29, 78, 216)"
        size={60}
      />
    </div>
  )
  
}
