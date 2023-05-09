import './Loading.scoped.sass';

export function Loading(props: any) {
    return (
        <div id="loader">
            <div>
            </div>
        </div>
    );
}

export function demoAsyncCall() {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
}