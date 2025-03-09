import {Inject} from "@nestjs/common";
import {ICommand, IEvent, UnhandledExceptionBus} from "@nestjs/cqrs";

export function WithUnhandledExceptionBus (): MethodDecorator {
    const injectService = Inject(UnhandledExceptionBus);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        injectService(target, "unhandledExceptionBus");

        descriptor.value = async function (commandOrEvent: ICommand | IEvent) {
            const unhandledExceptionBus: UnhandledExceptionBus = this.unhandledExceptionBus;

            try {
                const result = await originalMethod.apply(this, [commandOrEvent]);

                return result;
            } catch (error) {
                unhandledExceptionBus.publish({
                    "cause": commandOrEvent,
                    "exception": error
                });
            }
        };

        return descriptor;
    };
}
