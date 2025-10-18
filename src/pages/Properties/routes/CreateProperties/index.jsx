import {useEffect, useState} from "react"
import {Link} from "react-router-dom"

export default function SignupForm() {

    useEffect(() => {
        document.title = "افزودن ملک | آشیانه"
    }, []);

    return (
        <div>
            افزودن ملک
        </div>
    )
}