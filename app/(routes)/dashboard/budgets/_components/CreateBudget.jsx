"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Button } from '../../../../../components/ui/button';

function CreateBudget() {
  const [emojiIcon, setEmojiIcon] = useState('😊');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
            <h2 className='text-3xl'>+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            {/* Use asChild so DialogDescription doesn't force <p> */}
            <DialogDescription asChild>
              <div>
                <Button
                  variant="outline"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>

                {openEmojiPicker && (
                  <div className="relative mt-2">
                    <div className="absolute z-50">
                      <EmojiPicker
                        onEmojiClick={(emojiObject) => setEmojiIcon(emojiObject.emoji)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateBudget
