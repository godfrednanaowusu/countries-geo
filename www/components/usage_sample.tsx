'use client'

import { Flex } from "@radix-ui/themes";
import { useState } from "react";
import {Continents, Countries, States, Cities} from '../../package/src'
import ComboBox from "./combo_box";
import Flag from "react-world-flags";


export default function UsageSample(){
    const [getContinent, setContinent] = useState('')
    const [getCountry, setCountry] = useState('')
    const [getState, setState] = useState('')
    const [getCity, setCity] = useState('')
    return (
        <Flex gap={'3'} >
            
             <ComboBox
                                placeholder="Select Continent"
                                noItemsText={"All Continents"}
                                value={getContinent}
                                onValueChange={setContinent}
                                width={"auto"}
                                items={Continents?.getAll?.map((val: any) => ({
                                  value: val.iso,
                                  text: val.name,
                                }))}
                              />


<ComboBox
                                placeholder="Select Country"
                                noItemsText={"All Countries"}
                                value={getCountry}
                                onValueChange={setCountry}
                                width={"auto"}
                                items={Countries?.getByContinent(getContinent)?.map((val: any) => ({
                                  value: val.iso,
                                  icon: (
                                    <Flag
                                      height={15}
                                      width={20}
                                      code={val.iso}
                                      style={{ borderRadius: 3 }}
                                    />
                                  ),
                                  text: val.name,
                                }))}
                              />

<ComboBox
                                placeholder="Select State"
                                noItemsText={"All States"}
                                value={getState}
                                onValueChange={setState}
                                width={"auto"}
                                items={States?.getByCountry(getCountry)?.map((val: any) => ({
                                  value: val.iso,
                                  text: val.name,
                                }))}
                              />

<ComboBox
                                placeholder="Select City"
                                noItemsText={"All Cities"}
                                value={getCity}
                                onValueChange={setCity}
                                width={"auto"}
                                items={Cities?.getByState(`${getCountry}-${getState}`)?.map((val: any) => ({
                                  value: val.iso,
                                  text: val.name,
                                }))}
                              /> 
        </Flex>
    )
}