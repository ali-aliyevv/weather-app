import React from 'react'
import { FaSearch } from "react-icons/fa";
import {Input} from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
type Props={
    className?:string
    value:string 
    onChange:React.ChangeEventHandler<HTMLInputElement> | undefined
    onSubmit:React.FormEventHandler<HTMLFormElement> | undefined
}
export default function SearchBox(props:Props){
    return(
        <form className={cn('flex items-center',props.className)} onSubmit={props.onSubmit}>
       <Input className='ml-3 border-black ' placeholder='Search' onChange={props.onChange} value={props.value}/>
        <Button className='ml-3'><FaSearch /></Button>
    </form>
    )
}
