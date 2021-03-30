export const patterns = {
    email: /^([a-zA-Z0-9-]+[a-zA-Z0-9-.]*[a-zA-Z0-9-]|[a-zA-Z0-9-]+)@[A-Za-z0-9-]+[.]*[A-Za-z0-9-]*\.[A-Za-z0-9-]+$/,
    password: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
    name: /^[а-щіїьюяґєыъё']+$/i,
    phone: /^\+(\d){6,15}$/,
}

export function checker(value: string | undefined, pattern: RegExp) {
    if (value && pattern.test(value)) {
        return ''
    }
    else if (value && !pattern.test(value)) {
        return 'incorrect'
    }
}