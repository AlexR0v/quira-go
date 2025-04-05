import { Button } from '@/components/ui/button.tsx'
import {useLogout} from "@/app/api/query-hooks/useAuth.tsx";

const Home = () => {

    const {mutate} = useLogout()

  return (
    <div>
      <Button variant='primary'>Primary</Button>
      <Button variant='destructive'>Primary</Button>
      <Button variant='outline'>Primary</Button>
      <Button variant='secondary'>Primary</Button>
      <Button variant='ghost'>Primary</Button>
      <Button variant='muted'>Primary</Button>
      <Button variant='light' onClick={() => mutate()}>Logout</Button>
    </div>
  )
}
export default Home
