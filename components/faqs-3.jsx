'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '/components/ui/accordion'
import { DynamicIcon } from 'lucide-react/dynamic';
import Link from 'next/link'

export default function FAQsThree() {
    const faqItems = [
        {
            id: 'item-1',
            icon: 'clock',
            question: 'How do I create budgets?',
            answer: 'Go to budgets, in the navigation bar and click on the button that says create budget and there you can choose an emoji that you want to represent that budget and then give the name of the budget and the amount and click the button that says create budget.',
        },
        {
            id: 'item-2',
            icon: 'credit-card',
            question: 'How do I add expenses?',
            answer: 'You can click the budget card that you want to specifically add expenses to and the on the right side you are going to find the add Expense there you can add expense name and amount and click on add expense and then you can see the list of your expense down there.',
        },
        {
            id: 'item-3',
            icon: 'truck',
            question: 'Can I edit my Budget?',
            answer: 'Yes, go to the specific budget you want to edit and click the edit button next to the delete budget above the add expense and a dialog will come up whith your current budget detail, then you can edit however you want.',
        },
        {
            id: 'item-4',
            icon: 'globe',
            question: 'Do you offer localized support?',
            answer: 'We offer multilingual support in English, Spanish, French, German, and Japanese. Our support team can assist customers in these languages via email, chat, and phone during standard business hours for each respective region.',
        },
        {
            id: 'item-5',
            icon: 'package',
            question: 'How do I track my Progress?',
            answer: 'once you create a budget you can track the your progress from the card specific to that budget and at the buttom of the card you can see how much you spent and the remaining you have and there is your progress bar that you can see easly.',
        },
    ]

    return (
        <section className="bg-muted dark:bg-background py-20">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-20">
                            <h2 className="mt-4 text-3xl font-bold">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground mt-4">
                                Can't find what you're looking for? Contact our{' '}
                                <Link href="#" className="text-primary font-medium hover:underline">
                                    customer support team
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="bg-background shadow-xs rounded-lg border px-4 last:border-b">
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-6">
                                                <DynamicIcon name={item.icon} className="m-auto size-4" />
                                            </div>
                                            <span className="text-base">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                        <div className="px-9">
                                            <p className="text-base">{item.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    );
}
