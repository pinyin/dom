import {Maybe, notExisting} from '@pinyin/maybe'

export function hasStyle(style: Maybe<string>): style is string {
    return !(style === 'none' || style === '' || notExisting(style));
}
