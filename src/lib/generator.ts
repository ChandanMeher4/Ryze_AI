

export function generateReactCode(schema: any): string {
  if (!schema || !schema.components) return "";

  const renderProps = (props: any) => {
    return Object.entries(props)
      .map(([key, value]) => {
        
        if (key === "items" && Array.isArray(value)) {
          return `items={[${value.map((v) => `"${v}"`).join(", ")}]}`;
        }
        
        if (typeof value === "string") return `${key}="${value}"`;
        
        return `${key}={${value}}`;
      })
      .join(" ");
  };

  const renderComponent = (component: any, indent = 2): string => {
    const spaces = " ".repeat(indent);
    const props = renderProps(component.props || {});
    const hasChildren = component.children && component.children.length > 0;

    if (!hasChildren) {
      return `${spaces}<${component.type} ${props} />`;
    }

    const childrenCode = component.children
      .map((child: any) => renderComponent(child, indent + 2))
      .join("\n");

    return `${spaces}<${component.type} ${props}>\n${childrenCode}\n${spaces}</${component.type}>`;
  };

  const componentsCode = schema.components
    .map((c: any) => renderComponent(c))
    .join("\n\n");

  return `export default function GeneratedUI() {
  return (
    <div className="flex flex-row h-full w-full gap-4 p-4">
${componentsCode}
    </div>
  );
}`;
}