import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updatePageState } from '../redux/slicePage';

export default function Main() {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(updatePageState({
            navItems: [
                {icon: "ImportExport", link: "./importexport"},
                {icon: "Add", link: "./add"},
            ],
            title: ""
        }));
    }, [dispatch]);

    return (
        <div>
            <h1>HELLO</h1>
        </div>
    )
}