import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import { T } from '@/app/components/locale_provider'
import en from '@/messages/en.json'

// English comment text in code blocks -> message key, so docs MDX keeps plain English code
const commentKeys = new Map(Object.entries(en.code).map(([key, phrase]) => [phrase, `code.${key}`]))
const COMMENT_RE = /^(.*\/\/\s*)(.*?)(:?\s*)$/

// Swap known comment phrases inside highlighted code tokens for translated text
function localizeComments(node: ReactNode): ReactNode {
    if (typeof node === 'string') {
        const match = node.match(COMMENT_RE)
        const key = match && commentKeys.get(match[2])
        return key ? <>{match[1]}<T k={key} />{match[3]}</> : node
    }
    if (Array.isArray(node)) return Children.map(node, localizeComments)
    if (isValidElement<{ children?: ReactNode }>(node) && node.props.children !== undefined) {
        return cloneElement(node as ReactElement<{ children?: ReactNode }>, undefined, localizeComments(node.props.children))
    }
    return node
}

export function useMDXComponents(components: any = {}) {
    const themeComponents = getThemeComponents(components)
    const Pre = themeComponents.pre
    return {
        ...themeComponents,
        pre: (props: any) => <Pre {...props}>{localizeComments(props.children)}</Pre>,
    }
}
