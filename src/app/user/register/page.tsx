'use client';

// System Components import
import Image from 'next/image'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios, { AxiosResponse } from "axios"
import { useRouter } from 'next/navigation'

// UI Components import
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowRight } from 'lucide-react';


const formSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string()
});

const Page = () => {

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Cliked!!")
        try {
            const response: AxiosResponse = await axios.post('http://localhost:8080/api/user/register', values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            if (response.status === 200) {
                window.localStorage.setItem("name", data.name);
                window.localStorage.setItem("email", data.email);
                toast.success(data.message || "Registration successful!", {
                    style: {
                        "backgroundColor": "#D5F5E3",
                        "color": "black",
                        "border": "none"
                    },
                    duration: 1500
                });
                form.reset();
                router.push('/user/login');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                if (status === 401) {
                    toast.error(data.error || "Invalid Password", {
                        style: {
                            "backgroundColor": "#FADBD8",
                            "color": "black",
                            "border": "none"
                        },
                        duration: 2500
                    })
                    form.resetField('password');
                } else if (status === 404) {
                    toast.error(data.error, {
                        style: {
                            "backgroundColor": "#FADBD8",
                            "color": "black",
                            "border": "none"
                        },
                        duration: 2500
                    });
                    form.reset();
                } else {
                    toast.error(data.error || "Some Error Occured", {
                        style: {
                            "backgroundColor": "#FADBD8",
                            "color": "black",
                            "border": "none"
                        },
                        duration: 2500
                    });
                    form.reset();
                }
            } else {
                toast.error("An unexpected error occurred. Please try again.", {
                    invert: false,
                    duration: 2500
                });
            }
        }
    }

    return (
        <React.Fragment>
             <main className=' h-screen w-screen overflow-hidden flex flex-row justify-center items-center'>
               <section
                    className="backdrop-blur-md max-w-[50vw] max-md:max-w-[90vw] w-full h-screen overflow-hidden flex flex-col justify-center items-center gap-5 mx-auto z-10 absolute rounded-lg shadow-lg max-md:gap-3 max-md:p-4
max-md:h-fit max-md:w-fit">
                    <h1 className=' text-3xl font-bold z-20 max-md:text-black'>
                        Registration
                    </h1>
                    <Card className=' max-w-[30vw] max-md:max-w-[75vw] max-lg:max-w-[40vw] w-full max-md:z-10'>
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input className='placeholder:text-gray-800 border-black' placeholder="enter your name.." type='text' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input className='placeholder:text-gray-800 border-black' placeholder="someone@example.com" type='email' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input className='placeholder:text-gray-800 border-black' placeholder="password" type='password' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className=' w-full h-fit flex items-center justify-center'>
                                        <Button
                                            type="submit"
                                            className='cursor-pointer rounded-sm bg-blue-500 hover:bg-blue-600 max-w-sm w-full'>
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                                <p className="pt-3 flex justify-center items-center text-sm text-muted-foreground max-md:w-full">
  Don't have an account?
                                    <a onClick={()=>{router.push("/user/login")}} className="ml-2 inline-flex items-center gap-1 text-primary font-medium hover:underline hover:text-primary/80 transition-colors duration-150 cursor-pointer">
   <ArrowRight className="h-4 w-4" />
                                        Login
                                    </a>
                                </p>
                            </Form>
                        </CardContent>
                    </Card>
                </section>
                <Image
                                    src={'/assets/admin.jpg'}
                                    alt='Admin Page'
                                    width={800}
                                    height={800}
                                    className='w-full  h-screen object-cover max-md:absolute max-md:w-fit max-md:h-full'
                                    priority
                                />
            </main>
        </React.Fragment>
    )
}

export default Page