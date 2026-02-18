import { Arrow, Content, Root, Trigger } from "@radix-ui/react-tooltip";

export function Tooltip({
	children,
	content,
	open,
	defaultOpen,
	onOpenChange,
	...props
}) {
	return (
		<Root
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
		>
			<Trigger asChild>
				{children}
			</Trigger>
			<Content side="top" align="center" {...props}>
				{content}
				<Arrow width={11} height={5} />
			</Content>
		</Root>
	);
}
