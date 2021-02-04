import Link from "next/link";
import Button from "@material-ui/core/Button";

export class BaseLink extends React.Component {
  render() {
    return <Link href={this.props.href} as={this.props.hrefAs}>
      <a className={this.props.className}>
        {this.props.children}
      </a>
    </Link>;
  }
}

export class ALink extends React.Component {
  render() {
    return <BaseLink href={this.props.href} as={this.props.hrefAs} className={this.props.className}>{this.props.children}</BaseLink>;
  }
}

export class ButtonLink extends React.Component {
  render() {
    return <BaseLink href={this.props.href} as={this.props.hrefAs} className={this.props.className}>
      <Button variant={this.props.buttonVariant} color={this.props.buttonColor} component='a' size={this.props.buttonSize}>
        {this.props.children}
      </Button>
    </BaseLink>;
  }
}
