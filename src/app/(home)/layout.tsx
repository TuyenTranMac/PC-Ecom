import Navbar from "./navbar";

interface Props{
    children: React.ReactNode;
}

const layout = ({children} : Props) => {
  return (
    <div>
        <Navbar/>
    {children}
    </div>
  )
}

export default layout