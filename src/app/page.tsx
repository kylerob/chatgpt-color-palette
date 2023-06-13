'use client';

import React, { Fragment, useState } from "react";
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Configuration, OpenAIApi } from "openai";

export default function Home() {
  const [orgId, setOrgId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [companyName, setCompanyName] = useState('Twitter');
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState(["#1DA1F2","#14171A","#657786","#AAB8C2","#E1E8ED","#F5F8FA"]); // Twitter default

  const callChatGPT = async() => {
    setLoading(true);
    const config = new Configuration({
      organization: orgId,
      apiKey: apiKey
    });
    const openapi = new OpenAIApi(config);
    const response = await openapi.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [
          {role: "user", content: `What are the hex color codes for ${companyName}'s logo in just a single-line JavaScript array with no other explanations or variable name?`}
      ]
    });
    setLoading(false);

    const unparsedColors = response.data.choices[0].message?.content?.replaceAll(`'`, `"`);
    try {
      const parsedColors = JSON.parse(unparsedColors ?? '');
      // remove duplicates 
      setColors(Array.from(new Set(parsedColors)));
    } catch(error)
    {
      console.log('Unable to parse that company response');
    }
  };

  return (
    <div>
        <ApiButton orgId={orgId} apiKey={apiKey} onOrgIdUpdate={(id: string) => setOrgId(id)} onApiKeyUpdate={(key: string) => setApiKey(key)} />
      <div className="fixed top-20 lg:top-10 left-1/2 -translate-x-1/2">
        <div className="h-12 w-full rounded-md bg-gradient-to-r from-[#C6FFDD] via-[#FBD786] to-[#f7797d] p-1">
          <div className="relative">
          <input type="text" onChange={(e) => setCompanyName(e.target.value)} value={companyName} className="py-2 px-4 pr-[4.5rem] w-80 lg:w-96 focus:outline-none rounded" placeholder="Company name (e.g. Twitter)" onKeyDown={(e) => e.key === 'Enter' ? callChatGPT() : null}/> 
          <kbd className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg" onClick={() => callChatGPT()}>Enter</kbd>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 justify-between w-screen h-screen" style={{gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))`}}>
        {colors.map((color) => <div className="h-screen flex justify-center items-center" style={{backgroundColor: color}} key={color}>
        <div className="flex items-center px-4 py-2 bg-slate-800 bg-opacity-50 cursor-pointer rotate-90 md:rotate-0">
          {/* <!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
          <svg className="mr-3 fill-gray-100" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
          <span className="text-white">{color}</span>
          </div>
          </div>
          )}
      {/* <form>
        <input type="text" onChange={e => handleChange(e.target.value)} value={prompt} placeholder="Enter your prompt" />
        <button onClick={callChatGPT}>Submit</button>
      </form> */}
      {/* {loading ? 
        (<div>loading</div>) :
        (<div>{response}</div>)
      } */}
      </div>
    </div>
  )
}

interface ApiButtonProps {
  orgId: string,
  apiKey: string,
  onOrgIdUpdate: (id: string) => void;
  onApiKeyUpdate?: (key: string) => void;
}

function ApiButton({orgId, apiKey, onOrgIdUpdate, onApiKeyUpdate}: ApiButtonProps) {
  return <div className="fixed top-6 right-0 px-4"><Popover className="relative">
  {({ open }) => (
    <>
      <Popover.Button
        className={`
          ${open ? '' : 'text-opacity-90'}
          group inline-flex items-center rounded-md bg-gray-700 bg-opacity-90 px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <div>{orgId && apiKey ? <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> <span>API Ready</span></div> : <div className="flex items-center space-x-2
        "><div className="w-2 h-2 rounded-full bg-red-500"></div> <span>API Key Required</span></div>}</div>
        <ChevronDownIcon
          className={`${open ? '' : 'text-opacity-70'}
            ml-2 h-5 w-5 text-white transition duration-150 ease-in-out group-hover:text-opacity-80`}
          aria-hidden="true"
        />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute z-10 mt-3 w-screen max-w-sm right-0 transform px-4 sm:px-0 lg:max-w-md">
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="relative flex flex-col bg-white p-7">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Org ID
              </label>
              <input autoFocus className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" onChange={e => onOrgIdUpdate(e.target.value)} value={orgId} />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                API Key
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" onChange={e => onApiKeyUpdate(e.target.value)} value={apiKey} />
            </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </>
  )}
</Popover>
</div>
}