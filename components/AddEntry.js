import React, { Component } from "react"
import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from "../utils/helpers"
import UdaciSlider from "./UdaciSlider"
import UdaciSteppers from "./UdaciSteppers"
import DateHeader from "./DateHeader"
import { Ionicons } from "@expo/vector-icons"
import TextButton from "./TextButton"
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.btn}>
        <Text>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 230,
    swim: 8,
    sleep: 0,
    eat: 5,
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count,
      }
    })
  }

  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      }
    })
  }

  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }))
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state

    // Update Redux
    this.props.dispatch(addEntry({
      [key]: entry
    }))

    this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))

    // Navigate to home

    // Save to "DB"
    submitEntry({ key, entry })

    // Clear local notification
  }
  reset = () => {
    const key = timeToString()

    // Update Redux
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }))

    // Route to Home

    removeEntry(key)
  }

  render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons name={"ios-happy-outline"} size={100} />
          <Text>You already logged your information for today.</Text>
          <TextButton onPress={this.reset}>Reset</TextButton>
        </View>
      );
    }

    return (
      <View>
        <DateHeader date={(new Date()).toLocaleDateString()}/>
        <Text>{JSON.stringify(this.state)}</Text>
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]

          return (
            <View key={key}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <UdaciSteppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />}
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}

function mapStateToProps (state) {
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry)

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#FF0000',
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
