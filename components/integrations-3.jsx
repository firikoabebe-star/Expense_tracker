import { Home, Car, Utensils, Shirt, Users, Hospital } from "lucide-react"; // using lucide-react icons
import { cn } from '/lib/utils'
import { Button } from '/components/ui/button'
import Link from 'next/link'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="bg-muted dark:bg-background py-24 md:py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="grid items-center sm:grid-cols-2">
                        <div className="dark:bg-muted/50 relative mx-auto w-fit">
                            <div
                                aria-hidden
                                className="bg-radial to-muted dark:to-background absolute inset-0 z-10 from-transparent to-75%" />
                            
                            {/* Row 1 */}
                            <div className="mx-auto mb-2 flex w-fit justify-center gap-2">
                                <IntegrationCard>
                                    <Home />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <Utensils />
                                </IntegrationCard>
                            </div>

                            {/* Row 2 */}
                            <div className="mx-auto my-2 flex w-fit justify-center gap-2">
                                <IntegrationCard>
                                    <Car />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <Shirt />
                                </IntegrationCard>
                            </div>

                            {/* Row 3 */}
                            <div className="mx-auto flex w-fit justify-center gap-2">
                                <IntegrationCard>
                                    <Users />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <Hospital />
                                </IntegrationCard>
                            </div>
                        </div>

                        {/* Text section */}
                        <div
                            className="mx-auto mt-6 max-w-lg space-y-6 text-center sm:mt-0 sm:text-left">
                            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
                                Track all your essential needs in one place
                            </h2>
                            <p className="text-muted-foreground">
                                From housing and food to family, health, and more — 
                                integrate all your expenses seamlessly with our tracker.
                            </p>

                            <Button variant="outline" size="sm" asChild>
                                <Link href="#">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const IntegrationCard = ({
    children,
    className,
    borderClassName
}) => {
    return (
        <div
            className={cn(
                'bg-background relative flex size-70 rounded-xl dark:bg-transparent',
                className
            )}>
            <div
                role="presentation"
                className={cn(
                    'absolute inset-0 rounded-xl border border-black/20 dark:border-white/25',
                    borderClassName
                )} />
            <div className="relative z-20 m-auto size-fit *:size-70">{children}</div>
        </div>
    );
}
